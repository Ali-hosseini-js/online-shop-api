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
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { BlogDto } from '../dtos/blog.dto';
import { BlogService } from '../services/blog.service';
import { BlogQueryDto } from '../dtos/blog-query.dto';
import { UpdateBlogDto } from '../dtos/update-blog.dto';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { request } from 'http';

@ApiTags('Blog')
// @ApiHeader({
//   name: 'apikey',
//   description: 'API KEY',
// })
@Controller('blog')
@UseGuards(JwtGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @Get()
  findAll(@Query() queryParams: BlogQueryDto) {
    return this.blogService.findAll(queryParams);
  }

  @Post()
  create(@Body() body: BlogDto, @User() user: string) {
    return this.blogService.create(body, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateBlogDto) {
    return this.blogService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.blogService.delete(id);
  }
}
