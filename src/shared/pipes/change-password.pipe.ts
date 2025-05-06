import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ChangePasswordDto } from 'src/user/dtos/change-password.dto';
import { UserService } from 'src/user/services/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChangePasswordPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}
  async transform(value: ChangePasswordDto, metadata: ArgumentMetadata) {
    const { id, oldPassword, newPassword } = value;
    const password = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{8,}$/;

    const isValidOldPassword = password.test(oldPassword);
    const isValdiNewPassword = password.test(newPassword);

    if (!isValdiNewPassword || !isValidOldPassword) {
      throw new BadRequestException(
        ' رمز عبور باید حداقل هشت کارکتر و شامل حروف و اعداد باشد',
      );
    }

    const user = await this.userService.findOne(id, { password: 1 });

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      throw new BadRequestException('رمز عبور قبلی صحیح نمی باشد');
    }

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(newPassword, salt);

    return {
      newPassword: hashedPassword,
      id: id,
    };
  }
}
