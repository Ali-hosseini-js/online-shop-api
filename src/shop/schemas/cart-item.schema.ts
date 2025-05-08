import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/product/schemas/product.schema';
import { Cart } from './cart.schema';

export interface CartItemInterface extends Document {
  _id: Types.ObjectId;
  product: Product;
  quantity: number;
  cart: Cart;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class CartItem extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  product: Product;

  @Prop({
    required: false,
    default: 1,
  })
  quantity: number;

  @Prop({
    type: Types.ObjectId,
    ref: Cart.name,
    required: true,
  })
  cart: Cart;
}

export const cartItemSchema = SchemaFactory.createForClass(CartItem);
