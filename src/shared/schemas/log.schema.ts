import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const logSchema = SchemaFactory.createForClass(Log);
