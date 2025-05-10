import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderStatus } from '../schemas/order.schema';
import { OrderItem } from '../schemas/order-item.schema';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { CartService } from './cart.service';
import { ShippingService } from './shipping.service';
import axios from 'axios';
import { ProductService } from 'src/product/services/product.service';
import { EditedBy } from 'src/product/schemas/inventory-record.schema';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InventoryRecordQueryDto } from 'src/product/dtos/inventory-record-query.dto';
import { sortFunction } from 'src/shared/utils/sort-utils';
import { OrderQueryDto } from '../dtos/order-query.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(OrderItem.name)
    private readonly orderItemModel: Model<OrderItem>,
    private readonly cartService: CartService,
    private readonly shippingService: ShippingService,
    private readonly productService: ProductService,
    @InjectQueue('callback-queue') private callbackQueue: Queue,
  ) {}

  async createOrder(body: CreateOrderDto, user: string) {
    const { addressId, cartId, shippingId } = body;

    const cart = await this.cartService.getCartDetails(cartId);

    const shipping = await this.shippingService.findOne(shippingId);

    const shippingPrice =
      cart.prices.totalWithDiscount < shipping.freeShippingThreshold
        ? shipping.price
        : 0;

    const order = new this.orderModel({
      user: user,
      shipping: shippingId,
      address: addressId,
      cart: cartId,
      totalWithDiscount: cart.prices.totalWithDiscount,
      totalWithoutDiscount: cart.prices.totalWithoutDiscount,
      shippingPrice: shippingPrice,
      finalPrice: cart.prices.totalWithDiscount + shippingPrice,
    });

    const bankResponse = await this.createPaymentRequest(order.finalPrice);

    if (bankResponse.code === 100) {
      order.refId = bankResponse?.authority;
      for (const item of cart.items) {
        const price = item?.product?.price;
        const discount = item?.product?.discount;
        const quantity = item?.quantity;

        const discountedPrice = price - price * (discount / 100);
        const itemsPriceWithDiscount = discountedPrice * quantity;
        const itemsPriceWithoutDiscount = price * quantity;

        const orderItem = new this.orderItemModel({
          product: item.product._id.toString(),
          order: order._id.toString(),
          quantity: item.quantity,
          priceWithDiscount: itemsPriceWithDiscount,
          priceWithoutDiscount: itemsPriceWithoutDiscount,
        });

        await orderItem.save();

        await this.productService.removeStock(
          item.product._id.toString(),
          item.quantity,
          EditedBy.Order,
          order._id.toString(),
        );
      }
      await order.save();

      await this.callbackQueue.add({ refId: order.refId }, { delay: 900000 });

      return order.refId;
    } else {
      throw new BadRequestException('در درگاه پرداخت مشکلی پیش آمده است');
    }
  }

  async findOrderByRefId(refId: string) {
    const order = await this.orderModel.findOne({ refId: refId });

    if (order) {
      return order;
    } else {
      throw new NotFoundException();
    }
  }

  async findOneOrder(id: string) {
    const order = await this.orderModel.findOne({ _id: id });

    if (order) {
      return order;
    } else {
      throw new NotFoundException();
    }
  }

  async checkOrder(id: string) {
    const order = await this.findOneOrder(id);

    try {
      const bankData = {
        merchant_id: process.env.MERCHANT_ID,
        amount: order.finalPrice * 10,
        authority: order.refId,
      };

      const response = await axios.post(
        process.env.BANK_VERIFY_URL as string,
        bankData,
      );

      const status = response?.data?.data?.status;

      if (status === 100 || status === 101) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async getOrderDetails(id: string) {
    const order = await this.orderModel
      .findOne({ _id: id })
      .populate('address', { content: 1 })
      .populate('shipping', { title: 1 })
      .populate('user', { firstName: 1, lastName: 1, mobile: 1 })
      .exec();
    const items = await this.findOrderItems(id);

    if (order) {
      return { order, items };
    } else {
      throw new NotFoundException();
    }
  }

  async changeOrderStatus(id: string, status: OrderStatus) {
    const order = await this.findOneOrder(id);
    order.status = status;

    if (status === OrderStatus.Canceled) {
      const items = await this.findOrderItems(order._id.toString());

      for (const item of items) {
        await this.productService.addStock(
          item.product._id.toString(),
          item.quantity,
          EditedBy.Order,
          order._id.toString(),
        );
      }
    }

    await order.save();
  }

  async createPaymentRequest(finalPrice: number) {
    const bankData = {
      amount: finalPrice * 10,
      description: 'توضیحات سفارش',
      merchant_id: process.env.MERCHANT_ID,
      callback_url: `${process.env.SERVER_URL}/site/order/callback`,
    };

    const response = await axios.post(process.env.BANK_URL as string, bankData);

    return response?.data?.data;
  }

  async findOrderItems(id: string) {
    const items = await this.orderItemModel
      .find({ order: id })
      .populate('product', { title: 1, thumbnail: 1 })
      .exec();

    return items;
  }

  async callback(refId: string) {
    const order = await this.findOrderByRefId(refId);

    if (order.status === OrderStatus.Paying) {
      const bankResponse = await this.checkOrder(order._id.toString());

      if (bankResponse) {
        order.status = OrderStatus.Paid;
        await this.cartService.removeCartAndItems(order.cart.toString());
      } else {
        order.status = OrderStatus.Canceled;
        const items = await this.findOrderItems(order._id.toString());

        for (const item of items) {
          await this.productService.addStock(
            item.product._id.toString(),
            item.quantity,
            EditedBy.Order,
            order._id.toString(),
          );
        }
      }

      await order.save();
    }
  }

  async findAll(queryParams: OrderQueryDto, selectObject: any = { __v: 0 }) {
    const { limit = 5, page = 1, sort, user, status } = queryParams;

    const query: any = {};

    if (user) {
      query.user = user;
    }
    if (status) {
      query.status = status;
    }

    const sortObject = sortFunction(sort);

    const orders = await this.orderModel
      .find(query)
      .sort(sortObject)
      .select(selectObject)
      .skip(page - 1)
      .limit(limit)
      .exec();

    const count = await this.orderModel.countDocuments(query);

    return { count, orders };
  }
}
