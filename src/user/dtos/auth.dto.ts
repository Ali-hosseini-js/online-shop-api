import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
