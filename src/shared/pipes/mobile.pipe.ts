import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { convertNumber } from '../utils/stringUtils';

@Injectable()
export class MobilePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value?.mobile) {
      const mobile = /^09\d{9}$/;

      const englishMobile = convertNumber(value.mobile);

      const isValidMobile = mobile.test(englishMobile);

      if (!isValidMobile) {
        throw new BadRequestException('شماره همراه را صحیح وارد نمایید');
      }
      return { ...value, mobile: englishMobile };
    }

    return value;
  }
}
