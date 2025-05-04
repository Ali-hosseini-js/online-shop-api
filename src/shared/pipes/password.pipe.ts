import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordPipe implements PipeTransform {
  constructor(private readonly isNew: boolean) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value?.password) {
      const password = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{8,}$/;

      const isValidPassword = password.test(value?.password);

      if (!isValidPassword) {
        throw new BadRequestException(
          ' رمز عبور باید حداقل هشت کارکتر و شامل حروف و اعداد باشد',
        );
      } else {
        if (this.isNew) {
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(value.password, salt);
          return { ...value, password: hashedPassword };
        } else {
          return value;
        }
      }
    }
    return value;
  }
}
