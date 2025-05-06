import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SeoDto {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  seoTitle: string;

  @IsString()
  @IsNotEmpty()
  seoDescription: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  h1?: string;
}
