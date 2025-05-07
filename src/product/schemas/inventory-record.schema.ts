import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './product.schema';

export enum Action {
  Add = 'add',
  Remove = 'remove',
}

export enum EditedBy {
  Admin = 'admin',
  Order = 'order',
}
@Schema({ timestamps: true })
export class InventoryRecord extends Document {
  @Prop()
  quantity: number;

  @Prop()
  action: Action;

  @Prop()
  editedBy: EditedBy;

  @Prop({ required: false, default: null })
  order: string;

  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  product: Product;
}

export const inventoryRecordSchema =
  SchemaFactory.createForClass(InventoryRecord);
