import { IsOptional, IsString } from 'class-validator';
import { GeneralQueryDto } from 'src/shared/dtos/general-query.dto';

export class InventoryRecordQueryDto extends GeneralQueryDto {
  @IsString()
  @IsOptional()
  product?: string;
}
