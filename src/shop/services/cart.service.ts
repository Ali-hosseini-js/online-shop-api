import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartInterface } from '../schemas/cart.schema';
import { Model } from 'mongoose';
import { CartItem } from '../schemas/cart-item.schema';
import { newCartDto } from '../dtos/new-cart.dto';
import { CartItemDto } from '../dtos/cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartInterface>,
    @InjectModel(CartItem.name) private readonly cartItemModel: Model<CartItem>,
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
  }

  async getCartDetails(id: string) {
    const cart = await this.findCart(id);
    const items = await this.findCartItems(id);

    if (cart || items) {
      return { cart, items };
    } else {
      throw new NotFoundException();
    }
  }
}
