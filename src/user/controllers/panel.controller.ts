import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { BodyIdPipe } from 'src/shared/pipes/body-id.pipe';
import { ChangePasswordPipe } from 'src/shared/pipes/change-password.pipe';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Role } from '../schemas/user.schema';

@ApiTags('panel')
@UseGuards(JwtGuard, new RoleGuard([Role.User]))
@ApiBearerAuth()
@Controller('panel')
export class PanelController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('change-password')
  changePassword(
    @Body(new BodyIdPipe(['id']), ChangePasswordPipe) body: ChangePasswordDto,
  ) {
    const { id, newPassword } = body;
    return this.userService.update(id, { password: newPassword });
  }
}
