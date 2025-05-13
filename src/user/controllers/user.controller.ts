import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { UserQueryDto } from '../dtos/user-query.dto';
import { UserDto } from '../dtos/user.dto';
import { FarsiPipe } from 'src/shared/pipes/farsi.pipe';
import { MobilePipe } from 'src/shared/pipes/mobile.pipe';
import { PasswordPipe } from 'src/shared/pipes/password.pipe';
import { PasswordInterceptor } from 'src/shared/interceptors/password.interceptor';
import { updateUserDto } from '../dtos/update-user.dto';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { Role } from '../schemas/user.schema';
import { RoleGuard } from 'src/shared/guards/role.guard';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtGuard, new RoleGuard([Role.Admin]))
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll(@Query() queryParams: UserQueryDto) {
    return this.userService.findAll(queryParams);
  }

  @Post()
  @UseInterceptors(PasswordInterceptor)
  create(@Body(FarsiPipe, MobilePipe, new PasswordPipe(true)) body: UserDto) {
    return this.userService.adminCreate(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(PasswordInterceptor)
  update(
    @Param('id') id: string,
    @Body(FarsiPipe, MobilePipe, new PasswordPipe(true)) body: updateUserDto,
  ) {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
