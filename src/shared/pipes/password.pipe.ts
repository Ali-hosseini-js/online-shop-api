import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value?.password) {
      const password = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{8,}$/;

      const isValidPassword = password.test(value?.password);

      if (!isValidPassword) {
        throw new BadRequestException(
          ' رمز عبور باید حداقل هشت کارکتر و شامل حروف و اعداد باشد',
        );
      }
    }
    return value;
  }
}
