import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './schemas/user.schema';
import { AuthController } from './controllers/auth.controller';
import { PanelController } from './controllers/panel.controller';
import { Address, addressSchema } from './schemas/address.schema';
import { AddressService } from './services/address.service';

@Module({
  controllers: [UserController, AuthController, PanelController],
  providers: [UserService, AddressService],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
      {
        name: Address.name,
        schema: addressSchema,
      },
    ]),
  ],
})
export class UserModule {}
