import { IsNotEmpty, IsOptional } from 'class-validator';

export class DeleteFileDto {
  @IsNotEmpty()
  fileName: string;

  @IsOptional()
  folder?: string;
}
