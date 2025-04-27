import { Module } from '@nestjs/common';
import { BlogController } from './controllers/blog.controller';
import { BlogService } from './services/blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, blogSchema } from './schemas/blog.schema';
import { BlogCategoryController } from './controllers/blog-category.controller';
import { BlogCategoryService } from './services/blog-category.service';
import {
  BlogCategory,
  blogCategorySchema,
} from './schemas/blog-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: blogSchema },
      { name: BlogCategory.name, schema: blogCategorySchema },
    ]),
  ],
  controllers: [BlogController, BlogCategoryController],
  providers: [BlogService, BlogCategoryService],
})
export class BlogModule {}
