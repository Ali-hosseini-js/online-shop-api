import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    unique: true,
    type: String,
    required: true,
  })
  mobile: string;

  @Prop()
  password: string;
}

export const userSchema = SchemaFactory.createForClass(User);
