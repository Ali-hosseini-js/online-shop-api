import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { UserQueryDto } from '../dtos/user-query.dto';
import { UserDto } from '../dtos/user.dto';
import { FarsiPipe } from 'src/shared/pipes/farsi.pipe';
import { MobilePipe } from 'src/shared/pipes/mobile.pipe';
import { PasswordPipe } from 'src/shared/pipes/password.pipe';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll(@Query() queryParams: UserQueryDto) {
    return this.userService.findAll(queryParams);
  }

  @Post()
  create(@Body(FarsiPipe, MobilePipe, PasswordPipe) body: UserDto) {
    return this.userService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UserDto) {
    return this.userService.update(id, body);
  }

  @Delete('id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
