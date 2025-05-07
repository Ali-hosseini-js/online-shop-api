import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/shared/decorators/user.decorator';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { newCartDto } from '../dtos/new-cart.dto';
import { BodyIdPipe } from 'src/shared/pipes/body-id.pipe';
import { CartService } from '../services/cart.service';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post()
  createNewCart(
    @Body(new BodyIdPipe(['product'])) body: newCartDto,
    @User() user: string,
  ) {
    return this.cartService.createNewCart(body, user);
  }

  @Get(':id')
  getCartDetails(@Param('id') id: string) {
    return this.cartService.getCartDetails(id);
  }
}
