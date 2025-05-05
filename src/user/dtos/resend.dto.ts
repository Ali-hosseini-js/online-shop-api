import { IsNotEmpty, IsString } from 'class-validator';

export class ResendDto {
  @IsNotEmpty()
  @IsString()
  mobile: string;
}
