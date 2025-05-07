import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GeneralQueryDto } from 'src/shared/dtos/general-query.dto';
import { TicketStatus } from '../schemas/ticket.schema';

export class TicketQueryDto extends GeneralQueryDto {
  @IsOptional()
  @IsString()
  user?: string;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;
}
