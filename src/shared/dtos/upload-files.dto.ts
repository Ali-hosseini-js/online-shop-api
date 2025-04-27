import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UploadFilesDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  files: any[];

  @IsOptional()
  folder?: string;

  @IsOptional()
  height?: number;

  @IsOptional()
  width?: number;
}
