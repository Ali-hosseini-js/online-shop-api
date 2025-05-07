import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export interface TicketInterface extends Document {
  _id: Types.ObjectId;
  title: string;
  user: User;
  status: TicketStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum TicketStatus {
  Pending = 'pending',
  Responded = 'responded',
  Closed = 'closed',
}

@Schema({ timestamps: true })
export class Ticket extends Document {
  @Prop()
  title: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: User;

  @Prop()
  status: TicketStatus;
}

export const ticketSchema = SchemaFactory.createForClass(Ticket);
