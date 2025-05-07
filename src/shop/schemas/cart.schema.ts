import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export interface CartInterface extends Document {
  _id: Types.ObjectId;
  user: User;
}

@Schema()
export class Cart extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: User;
}

export const cartSchema = SchemaFactory.createForClass(Cart);
