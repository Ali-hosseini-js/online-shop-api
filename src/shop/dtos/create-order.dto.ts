import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  cartId: string;

  @IsString()
  @IsNotEmpty()
  shippingId: string;

  @IsString()
  @IsNotEmpty()
  addressId: string;
}
