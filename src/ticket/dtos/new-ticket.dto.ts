import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
export class NewTicketDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
