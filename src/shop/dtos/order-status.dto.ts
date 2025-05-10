import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';

export class OrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
