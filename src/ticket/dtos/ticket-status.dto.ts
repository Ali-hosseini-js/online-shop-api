import { IsEnum, IsNotEmpty } from 'class-validator';
import { TicketStatus } from '../schemas/ticket.schema';

export class TicketStatusDto {
  @IsNotEmpty()
  @IsEnum(TicketStatus)
  status: TicketStatus;
}
