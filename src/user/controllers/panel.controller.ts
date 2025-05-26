import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { BodyIdPipe } from 'src/shared/pipes/body-id.pipe';
import { ChangePasswordPipe } from 'src/shared/pipes/change-password.pipe';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { AddressService } from '../services/address.service';
import { AddressQueryDto } from '../dtos/address-query.dto';
import { AddressDto } from '../dtos/address.dto';
import { UpdateAddressDto } from '../dtos/update-address.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { Response } from 'express';

@ApiTags('Panel')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('panel')
export class PanelController {
  constructor(
    private readonly userService: UserService,
    private readonly addressService: AddressService,
  ) {}

  @Get('address')
  findAllAddresses(@Query() queryParams: AddressQueryDto) {
    return this.addressService.findAll(queryParams);
  }

  @Get('address/byUser')
  async findAllUserAddresses(
    @Query() queryParams: AddressQueryDto,
    @User() user: string,
  ) {
    const address = await this.addressService.findAddressByUser(user);

    if (address) {
      return this.addressService.findAll(queryParams);
    } else {
      throw new NotFoundException('آدرسی برای این کاربر ثبت نشده است');
    }
  }

  @Post('address')
  createAddress(@Body() body: AddressDto, @User() user: string) {
    return this.addressService.create(body, user);
  }

  @Get('address/:id')
  findOneAddress(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch('address/:id')
  editAddress(@Param('id') id: string, @Body() body: UpdateAddressDto) {
    return this.addressService.update(id, body);
  }

  @Delete('address/:id')
  deleteAddress(@Param('id') id: string) {
    return this.addressService.delete(id);
  }

  @Get('user')
  findOne(@User() user: string) {
    return this.userService.findOne(user);
  }

  @Patch('change-password')
  changePassword(
    @Body(new BodyIdPipe(['id']), ChangePasswordPipe) body: ChangePasswordDto,
  ) {
    const { id, newPassword } = body;
    return this.userService.update(id, { password: newPassword });
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: false, // Must match `secure` in setCookie
      sameSite: 'lax', // Must match `sameSite` in setCookie
      path: '/', // Must match `path` in setCookie
    });

    return { success: true, message: 'از اکانت خود خارج شدید' };
  }
}
