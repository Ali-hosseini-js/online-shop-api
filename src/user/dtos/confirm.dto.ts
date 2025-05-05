import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmDto {
  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
