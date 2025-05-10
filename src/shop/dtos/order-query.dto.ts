import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GeneralQueryDto } from 'src/shared/dtos/general-query.dto';
import { OrderStatus } from '../schemas/order.schema';

export class OrderQueryDto extends GeneralQueryDto {
  @IsOptional()
  @IsString()
  user?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
