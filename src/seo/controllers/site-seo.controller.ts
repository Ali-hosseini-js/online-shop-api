import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { SeoService } from '../services/seo.service';
import { ApiTags } from '@nestjs/swagger';
import { SeoQueryDto } from '../dtos/seo-query.dto';
import { UrlPipe } from 'src/shared/pipes/url.pipe';

@ApiTags('site seo')
@Controller('site/seo')
export class SiteSeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get()
  getSeoItem(@Query(UrlPipe) queryParams: SeoQueryDto) {
    if (queryParams.url) {
      return this.seoService.findOneWithUrl(queryParams.url);
    } else {
      return new NotFoundException('یافت نشد');
    }
  }
}
