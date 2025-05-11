import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '../schemas/user.schema';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  lastName?: string;

  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  password?: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
