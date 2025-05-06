import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogCategoryService } from '../services/blog-category.service';
import { BlogCategoryQueryDto } from '../dtos/blog-category-query.dto';
import { ApiTags } from '@nestjs/swagger';
import { BlogService } from '../services/blog.service';
import { BlogQueryDto } from '../dtos/blog-query.dto';

@ApiTags('Public Blog')
@Controller('site/blog')
export class SiteBlogController {
  constructor(
    private readonly blogCategoryService: BlogCategoryService,
    private readonly blogService: BlogService,
  ) {}

  @Get('categories')
  findCategories(@Query() queryParams: BlogCategoryQueryDto) {
    return this.blogCategoryService.findAll(queryParams, {
      title: 1,
      url: 1,
      image: 1,
    });
  }

  @Get('category/:url')
  async findCategory(
    @Param('url') url: string,
    @Query() queryParams: BlogQueryDto,
  ) {
    const category = await this.blogCategoryService.findOneWithUrl(url);

    const { blogs, count } = await this.blogService.findAll(
      { ...queryParams, category: category._id.toString() },
      {
        title: 1,
        url: 1,
        image: 1,
      },
    );

    return { category, blogs, count };
  }

  @Get(':url')
  async findBlog(@Param('url') url: string) {
    const blog = await this.blogService.findOneWithUrl(url);

    const relatedBlogs = await this.blogService.findAll(
      {
        category: blog.category._id.toString(),
        exclude: [blog._id.toString()],
      },
      { title: 1, url: 1, image: 1 },
    );
    return { blog, relatedBlogs };
  }
}
