import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartInterface } from '../schemas/cart.schema';
import { Model } from 'mongoose';
import { CartItem, CartItemInterface } from '../schemas/cart-item.schema';
import { newCartDto } from '../dtos/new-cart.dto';
import { CartItemDto } from '../dtos/cart-item.dto';
import { EditcartItemDto } from '../dtos/edit-cart-item.dto';
import { DeleteCartItemDto } from '../dtos/delete-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(CartItem.name)
    private readonly cartItemModel: Model<CartItem>,
  ) {}

  async createNewCart(body: newCartDto, user: string) {
    const newCart = new this.cartModel({
      user: user,
    });

    const newCartItem = await this.createCartItem({
      product: body.product,
      cart: newCart._id.toString(),
    });

    await newCart.save();

    return this.getCartDetails(newCart._id.toString());
  }

  async createCartItem(body: CartItemDto) {
    const newCartItem = new this.cartItemModel(body);
    await newCartItem.save();
    return newCartItem;
  }

  async findCart(id: string) {
    const cart = await this.cartModel.findOne({ _id: id }).exec();

    if (cart) {
      return cart;
    } else {
      throw new NotFoundException();
    }
  }

  async findCartItems(id: string) {
    const items = await this.cartItemModel
      .find({ cart: id })
      .populate('product', { title: 1, thumbnail: 1, price: 1, discount: 1 })
      .select({ product: 1, quantity: 1 })
      .sort({ createdAt: -1 })
      .exec();

    return items;
  }

  async getCartDetails(id: string) {
    const cart = await this.findCart(id);
    const items = await this.findCartItems(id);

    if (cart) {
      const prices = await this.getPrices(id);
      return { cart, items, prices };
    } else {
      throw new NotFoundException();
    }
  }

  async findCartItem(id: string) {
    const cartItem = await this.cartItemModel.findOne({ _id: id }).exec();

    if (cartItem) {
      return cartItem;
    } else {
      throw new NotFoundException();
    }
  }

  async editCart(id: string, body: EditcartItemDto) {
    const cartItem = await this.findCartItem(body.cartItem);

    cartItem.quantity = body.quantity;

    await cartItem.save();

    return this.getCartDetails(id);
  }

  async removeCartAndItems(id: string) {
    const items = await this.findCartItems(id);

    for (const item of items) {
      await this.deleteCartItem(item._id.toString());
    }

    await this.deleteCart(id);
  }

  async addItemToCart(id: string, body: newCartDto) {
    const items = await this.findCartItems(id);

    const oldItem = items.find(
      (item) => item.product._id.toString() === body.product,
    );

    if (oldItem?._id) {
      await this.editCart(id, {
        cartItem: oldItem._id.toString(),
        quantity: oldItem.quantity + 1,
      });
    } else {
      await this.createCartItem({
        product: body.product,
        cart: id,
      });
    }

    return this.getCartDetails(id);
  }

  async deleteCartItem(id: string) {
    const cartItem = await this.findCartItem(id);
    await cartItem.deleteOne();
    return cartItem;
  }

  async deleteCart(id: string) {
    const cart = await this.findCart(id);
    await cart.deleteOne();
    return cart;
  }

  async removeItemFromCart(id: string, body: DeleteCartItemDto) {
    await this.deleteCartItem(body.cartItem);

    const items = await this.findCartItems(id);

    if (items?.length) {
      return this.getCartDetails(id);
    } else {
      await this.deleteCart(id);
    }
  }

  async getPrices(id: string) {
    const items = await this.findCartItems(id);

    let totalWithoutDiscount = 0;
    let totalWithDiscount = 0;

    for (const item of items) {
      const price = item?.product?.price;
      const discount = item?.product?.discount;
      const quantity = item?.quantity;

      const discountedPrice = price - price * (discount / 100);
      const itemsPriceWithDiscount = discountedPrice * quantity;
      const itemsPriceWithoutDiscount = price * quantity;

      totalWithoutDiscount += itemsPriceWithoutDiscount;
      totalWithDiscount += itemsPriceWithDiscount;
    }

    return { totalWithoutDiscount, totalWithDiscount };
  }
}
