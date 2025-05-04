import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogCategoryDto } from '../dtos/blog-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BlogCategory } from '../schemas/blog-category.schema';
import { Model } from 'mongoose';
import { BlogCategoryQueryDto } from '../dtos/blog-category-query.dto';
import { sortFunction } from 'src/shared/utils/sort-utils';
import { deleteImage } from 'src/shared/utils/file-utils';
import { UpdateBlogCategryDto } from '../dtos/update-blog-category.dto';

@Injectable()
export class BlogCategoryService {
  constructor(
    @InjectModel(BlogCategory.name)
    private readonly blogCategoryModel: Model<BlogCategory>,
  ) {}

  async findAll(
    queryParams: BlogCategoryQueryDto,
    selectObject: any = { __v: 0 },
  ) {
    const { limit = 5, page = 1, title, sort } = queryParams;

    const query: any = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    const sortObject = sortFunction(sort);

    const blogCategories = await this.blogCategoryModel
      .find(query)
      .skip(page - 1)
      .sort(sortObject)
      .select(selectObject)
      .limit(limit)
      .exec();

    const count = await this.blogCategoryModel.countDocuments(query);

    return { count, blogCategories };
  }

  async findOne(id: string, selectObject: any = { __v: 0 }) {
    const blogCategory = await this.blogCategoryModel
      .findOne({ _id: id })
      .select(selectObject)
      .exec();
    if (blogCategory) {
      return blogCategory;
    } else {
      throw new NotFoundException();
    }
  }

  async create(body: BlogCategoryDto) {
    const newBlogCategory = new this.blogCategoryModel(body);
    await newBlogCategory.save();
    return newBlogCategory;
  }

  async update(id: string, body: UpdateBlogCategryDto) {
    const blogCategory = await this.findOne(id, { _id: 1, image: 1 });

    if (body?.image) {
      await deleteImage(blogCategory.image, 'blogCategory');
    }

    return await this.blogCategoryModel.findByIdAndUpdate(id, body, {
      new: true,
    });
  }

  async delete(id: string) {
    const blogCategory = await this.findOne(id);
    await deleteImage(blogCategory.image, 'blogCategory');
    await blogCategory.deleteOne();

    return blogCategory;
  }
}
