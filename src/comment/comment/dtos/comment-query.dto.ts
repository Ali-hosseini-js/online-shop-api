import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GeneralQueryDto } from 'src/shared/dtos/general-query.dto';
import { CommentStatus } from '../schemas/comment.schema';

export class CommentQueryDto extends GeneralQueryDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  user?: string;

  @IsOptional()
  @IsString()
  product?: string;

  @IsOptional()
  @IsEnum(CommentStatus)
  status?: CommentStatus;
}
