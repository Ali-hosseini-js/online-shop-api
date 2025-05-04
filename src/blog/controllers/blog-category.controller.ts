import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogCategoryDto } from '../dtos/blog-category.dto';
import { BlogCategoryService } from '../services/blog-category.service';
import { BlogCategoryQueryDto } from '../dtos/blog-category-query.dto';
import { UpdateBlogCategryDto } from '../dtos/update-blog-category.dto';
import { JwtGuard } from 'src/shared/guards/jwt.guard';

@ApiTags('BlogCategory')
@Controller('blog-category')
@UseGuards(JwtGuard)
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}
  @Get()
  findAll(@Query() queryParams: BlogCategoryQueryDto) {
    return this.blogCategoryService.findAll(queryParams);
  }

  @Post()
  create(@Body() body: BlogCategoryDto) {
    return this.blogCategoryService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogCategoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateBlogCategryDto) {
    return this.blogCategoryService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.blogCategoryService.delete(id);
  }
}
