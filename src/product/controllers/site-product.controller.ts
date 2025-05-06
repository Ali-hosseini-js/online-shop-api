import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductCategoryService } from '../services/product-category.service';
import { ProductCategoryQueryDto } from '../dtos/product-category-query.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { ProductQueryDto } from '../dtos/product-query.dto';

@ApiTags('Public Product')
@Controller('site/product')
export class SiteProductController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
    private readonly productService: ProductService,
  ) {}

  @Get('categories')
  findCategories(@Query() queryParams: ProductCategoryQueryDto) {
    return this.productCategoryService.findAll(queryParams, {
      title: 1,
      url: 1,
      image: 1,
    });
  }

  @Get('category/:url')
  async findCategory(
    @Param('url') url: string,
    @Query() queryParams: ProductQueryDto,
  ) {
    const category = await this.productCategoryService.findOneWithUrl(url);

    const { products, count } = await this.productService.findAll(
      { ...queryParams, category: category._id.toString() },
      {
        title: 1,
        url: 1,
        image: 1,
      },
    );

    return { category, products, count };
  }

  @Get(':url')
  async findProduct(@Param('url') url: string) {
    const product = await this.productService.findOneWithUrl(url);

    const relatedProducts = await this.productService.findAll(
      {
        category: product.category._id.toString(),
        exclude: [product._id.toString()],
      },
      {
        title: 1,
        url: 1,
        image: 1,
      },
    );

    return { product, relatedProducts };
  }
}
