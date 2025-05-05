import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto } from '../dtos/auth.dto';
import { MobilePipe } from 'src/shared/pipes/mobile.pipe';
import { PasswordPipe } from 'src/shared/pipes/password.pipe';
import { UserService } from '../services/user.service';
import { ConfirmDto } from '../dtos/confirm.dto';
import { ResendDto } from '../dtos/resend.dto';

@ApiTags('Authentications')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}
  @Post('sign-in')
  signin(@Body(MobilePipe, new PasswordPipe(false)) body: AuthDto) {
    return this.userService.signin(body);
  }

  @Post('confirm')
  confirm(@Body(MobilePipe) body: ConfirmDto) {
    return this.userService.confirm(body);
  }

  @Post('resend')
  resend(@Body(MobilePipe) body: ResendDto) {
    return this.userService.sendCode(body.mobile);
  }
}
