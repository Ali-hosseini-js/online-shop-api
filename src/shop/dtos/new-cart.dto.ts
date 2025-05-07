import { IsNotEmpty, IsString } from 'class-validator';

export class newCartDto {
  @IsString()
  @IsNotEmpty()
  product: string;
}
