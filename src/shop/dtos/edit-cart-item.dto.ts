import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class EditcartItemDto {
  @IsNotEmpty()
  @IsString()
  cartItem: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}
