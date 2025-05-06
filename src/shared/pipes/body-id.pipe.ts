import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class BodyIdPipe implements PipeTransform {
  constructor(private readonly items: string[]) {}
  transform(value: any, metadata: ArgumentMetadata) {
    const errorItems: string[] = [];

    for (const item of this.items) {
      if (value[item]) {
        if (!isValidObjectId(value[item])) {
          errorItems.push(item);
        }
      }
    }

    if (errorItems.length) {
      throw new BadRequestException(
        `فرمت آی دی این موارد صحیح نیست ${errorItems}`,
      );
    } else {
      return value;
    }
  }
}
