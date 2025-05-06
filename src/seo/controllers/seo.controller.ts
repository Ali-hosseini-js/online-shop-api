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
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Role } from 'src/user/schemas/user.schema';
import { SeoService } from '../services/seo.service';
import { SeoQueryDto } from '../dtos/seo-query.dto';
import { UrlPipe } from 'src/shared/pipes/url.pipe';
import { SeoDto } from '../dtos/seo.dto';

@ApiTags('Seo')
@UseGuards(JwtGuard, new RoleGuard([Role.Admin, Role.CopyRighter]))
@ApiBearerAuth()
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get()
  findAll(@Query() queryParams: SeoQueryDto) {
    return this.seoService.findAll(queryParams, { __v: 0 });
  }

  @Post()
  craete(@Body(UrlPipe) body: SeoDto) {
    return this.seoService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seoService.findOne(id, { __v: 0 });
  }

  @Patch(':id')
  edit(@Param('id') id: string, @Body(UrlPipe) body: SeoDto) {
    return this.seoService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.seoService.delete(id);
  }
}
