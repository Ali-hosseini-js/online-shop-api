import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Action, EditedBy } from '../schemas/inventory-record.schema';

export class InventoryRecordDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsEnum(Action)
  action: Action;

  @IsNotEmpty()
  @IsEnum(EditedBy)
  editedBy: EditedBy;

  @IsNotEmpty()
  @IsString()
  product: string;

  @IsString()
  @IsOptional()
  order: string;
}
