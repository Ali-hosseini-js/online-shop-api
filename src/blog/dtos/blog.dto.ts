import { IsNotEmpty, IsString } from 'class-validator';

export class BlogDto {
  @IsString()
  @IsNotEmpty({ message: 'عنوان نباید خالی باشد.' })
  title: string;
  @IsString()
  @IsNotEmpty()
  content: string;
}
