import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto } from '../dtos/auth.dto';
import { MobilePipe } from 'src/shared/pipes/mobile.pipe';
import { PasswordPipe } from 'src/shared/pipes/password.pipe';
import { UserService } from '../services/user.service';
import { ConfirmDto } from '../dtos/confirm.dto';
import { ResendDto } from '../dtos/resend.dto';
import { SignUpDto } from '../dtos/signup.dto';
import { FarsiPipe } from 'src/shared/pipes/farsi.pipe';
import { Role } from '../schemas/user.schema';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Authentications')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  // @Post('sign-in')
  // signin(@Body(MobilePipe, new PasswordPipe(false)) body: AuthDto) {
  //   return this.userService.signin(body);
  // }

  @Post('confirm')
  async confirm(
    @Body(MobilePipe) body: ConfirmDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.userService.confirm(body);

    // Set the cookie with more complete options
    response.cookie('access_token', result.token, {
      httpOnly: true,
      secure: false, // Only use secure in production
      sameSite: 'lax', // Helps with CSRF protection
      maxAge: 1 * 60 * 60 * 1000, // Example: 1 hour expiration
      path: '/', // Make cookie available across your site
    });

    return {
      success: true,
      message: 'ورود با موفقیت انجام شد',
    };
  }

  @Post('resend')
  resend(@Body(MobilePipe) body: ResendDto) {
    return this.userService.sendCode(body.mobile);
  }

  @Post('sign-up')
  async signup(
    @Body(FarsiPipe, MobilePipe, new PasswordPipe(true)) body: SignUpDto,
  ) {
    const user = await this.userService.create({ ...body, role: Role.User });

    if (user?._id) {
      return this.userService.sendCode(user.mobile);
    }
  }

  @Get('whoami')
  async whoami(@Req() request: Request) {
    try {
      const token = request?.cookies?.access_token;
      const payload = await this.jwtService.verifyAsync(token);
      return { role: payload?.role };
    } catch (error) {
      return { role: '' };
    }
  }
}
