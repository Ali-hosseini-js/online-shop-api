import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Role } from 'src/user/schemas/user.schema';
import { OrderService } from '../services/order.service';
import { OrderQueryDto } from '../dtos/order-query.dto';

@ApiTags('Panel Order')
@ApiBearerAuth()
@UseGuards(JwtGuard, new RoleGuard([Role.Admin, Role.User]))
@Controller('panel/order')
export class PanelOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll(@Query() queryParams: OrderQueryDto) {
    return this.orderService.findAll(queryParams);
  }

  @Get(':id')
  getOrderDetails(@Param('id') id: string) {
    return this.orderService.getOrderDetails(id);
  }
}
