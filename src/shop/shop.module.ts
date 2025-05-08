import { Module } from '@nestjs/common';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, cartSchema } from './schemas/cart.schema';
import { CartItem, cartItemSchema } from './schemas/cart-item.schema';
import { Shipping, shippingSchema } from './schemas/shipping.schema';
import { ShippingController } from './controllers/shipping.controller';
import { SiteShippingController } from './controllers/site-shipping.controller';
import { ShippingService } from './services/shipping.service';

@Module({
  controllers: [CartController, ShippingController, SiteShippingController],
  providers: [CartService, ShippingService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Cart.name,
        schema: cartSchema,
      },
      {
        name: CartItem.name,
        schema: cartItemSchema,
      },
      {
        name: Shipping.name,
        schema: shippingSchema,
      },
    ]),
  ],
})
export class ShopModule {}
