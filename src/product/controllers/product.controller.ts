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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductDto } from '../dtos/product.dto';
import { ProductService } from '../services/product.service';
import { ProductQueryDto } from '../dtos/product-query.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Role } from 'src/user/schemas/user.schema';
import { UrlPipe } from 'src/shared/pipes/url.pipe';
import { BodyIdPipe } from 'src/shared/pipes/body-id.pipe';

@ApiTags('Product')
@Controller('product')
@UseGuards(JwtGuard, new RoleGuard([Role.Admin, Role.CopyRighter]))
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  findAll(@Query() queryParams: ProductQueryDto) {
    return this.productService.findAll(queryParams);
  }

  @Post()
  create(@Body(UrlPipe, new BodyIdPipe(['category'])) body: ProductDto) {
    return this.productService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(UrlPipe, new BodyIdPipe(['category'])) body: UpdateProductDto,
  ) {
    return this.productService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
