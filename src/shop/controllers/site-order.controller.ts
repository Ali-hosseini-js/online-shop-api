import { Body, Controller, Post, Query, Res, UseGuards } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { User } from 'src/shared/decorators/user.decorator';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { BodyIdPipe } from 'src/shared/pipes/body-id.pipe';
import { Response } from 'express';

@ApiTags('Site Order')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('site/order')
export class SiteOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(
    @Body(new BodyIdPipe(['cartId', 'shippingId', 'addressId']))
    body: CreateOrderDto,
    @User() user: string,
  ) {
    return this.orderService.createOrder(body, user);
  }

  async callback(@Query() query: any, @Res() response: Response) {
    if (query.authority) {
      await this.orderService.callback(query.authority);
      return response.redirect('');
    } else {
      return response.redirect('');
    }
  }
}
