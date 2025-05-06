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
import { SiteBlogController } from './controllers/site-blog.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: blogSchema },
      { name: BlogCategory.name, schema: blogCategorySchema },
    ]),
  ],
  controllers: [BlogController, BlogCategoryController, SiteBlogController],
  providers: [BlogService, BlogCategoryService],
})
export class BlogModule {}
