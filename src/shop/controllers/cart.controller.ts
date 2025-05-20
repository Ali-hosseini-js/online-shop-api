import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/shared/decorators/user.decorator';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { newCartDto } from '../dtos/new-cart.dto';
import { BodyIdPipe } from 'src/shared/pipes/body-id.pipe';
import { CartService } from '../services/cart.service';
import { EditcartItemDto } from '../dtos/edit-cart-item.dto';
import { DeleteCartItemDto } from '../dtos/delete-cart-item.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post()
  async createNewCart(
    @Body(new BodyIdPipe(['product'])) body: newCartDto,
    @User() user: string,
  ) {
    const existingCart = await this.cartService.findCartByUser(user);
    if (existingCart) {
      // If cart exists, add the product to it
      return this.cartService.addItemToCart(existingCart._id.toString(), body);
    } else {
      // If no cart exists, create a new one
      return this.cartService.createNewCart(body, user);
    }
  }

  @Get()
  async findUserCart(@User() user: string) {
    const Cart = await this.cartService.findCartByUser(user);
    if (Cart) {
      return { id: Cart._id };
    }
  }

  @Get('byUser')
  async getUserCart(@User() user: string) {
    const cart = await this.cartService.findCartByUser(user);
    if (cart) {
      return this.cartService.getCartDetails(cart._id.toString());
    } else {
      throw new NotFoundException('محصولی در سبد خرید وجود ندارد');
    }
  }

  @Get(':id')
  getCartDetails(@Param('id') id: string) {
    return this.cartService.getCartDetails(id);
  }

  @Patch('edit-cart-item/:id')
  editCart(
    @Param('id') id: string,
    @Body(new BodyIdPipe(['cartItem'])) body: EditcartItemDto,
  ) {
    return this.cartService.editCart(id, body);
  }

  @Patch('add-to-cart/:id')
  addItemToCart(
    @Param('id') id: string,
    @Body(new BodyIdPipe(['product'])) body: newCartDto,
  ) {
    return this.cartService.addItemToCart(id, body);
  }

  @Delete('remove-from-cart/:id')
  removeItemFromCart(
    @Param('id') id: string,
    @Body(new BodyIdPipe(['cartItem'])) body: DeleteCartItemDto,
  ) {
    return this.cartService.removeItemFromCart(id, body);
  }
}
