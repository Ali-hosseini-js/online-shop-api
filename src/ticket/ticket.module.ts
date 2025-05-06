import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, ticketSchema } from './schemas/ticket.schema';
import {
  TicketMessage,
  ticketMessageSchema,
} from './schemas/ticket-message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ticket.name, schema: ticketSchema },
      { name: TicketMessage.name, schema: ticketMessageSchema },
    ]),
  ],
})
export class TicketModule {}
