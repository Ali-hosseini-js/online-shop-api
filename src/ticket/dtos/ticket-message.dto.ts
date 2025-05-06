import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
export class TicketMessageDto {
  @IsString()
  @IsNotEmpty()
  ticket: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
