import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Role } from 'src/user/schemas/user.schema';
import { OrderService } from '../services/order.service';
import { OrderQueryDto } from '../dtos/order-query.dto';
import { OrderStatusDto } from '../dtos/order-status.dto';

@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(JwtGuard, new RoleGuard([Role.Admin]))
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll(@Query() queryParams: OrderQueryDto) {
    return this.orderService.findAll(queryParams);
  }

  @Get(':id')
  getOrderDetails(@Param('id') id: string) {
    return this.orderService.getOrderDetails(id);
  }

  @Patch(':id')
  changeOrderStatus(@Param('id') id: string, @Body() body: OrderStatusDto) {
    return this.orderService.changeOrderStatus(id, body.status);
  }
}
