import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductCategoryService } from './services/product-category.service';
import { ProductCategoryController } from './controllers/product-category.controller';
import { Product, productSchema } from './schemas/product.schema';
import {
  ProductCategory,
  productCategorySchema,
} from './schemas/product-category.schema';
import { SiteProductController } from './controllers/site-product.controller';

@Module({
  controllers: [
    ProductController,
    ProductCategoryController,
    SiteProductController
  ],
  providers: [ProductService, ProductCategoryService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: productSchema,
      },
      {
        name: ProductCategory.name,
        schema: productCategorySchema,
      },
    ]),
  ],
})
export class ProductModule {}
