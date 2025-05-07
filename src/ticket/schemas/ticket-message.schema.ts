import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Ticket } from './ticket.schema';

export interface TicketMessageInterface extends Document {
  _id: Types.ObjectId;
  content: string;
  image?: string;
  ticket: Ticket;
  user: User;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

@Schema({ timestamps: true })
export class TicketMessage extends Document {
  @Prop({ required: false, default: null })
  content: string;

  @Prop({ required: false, default: null })
  image: string;

  @Prop({
    type: Types.ObjectId,
    ref: Ticket.name,
    required: true,
  })
  ticket: Ticket;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: User;
}

export const ticketMessageSchema = SchemaFactory.createForClass(TicketMessage);
