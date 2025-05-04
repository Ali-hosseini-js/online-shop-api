import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export enum LogType {
  Error = 'error',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}
@Schema({ timestamps: true })
export class Log extends Document {
  @Prop()
  content: string;
  @Prop()
  url: string;
  @Prop()
  type: LogType;
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: false,
  })
  user: User;
}

export const logSchema = SchemaFactory.createForClass(Log);
