import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Seo } from '../schemas/seo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SeoQueryDto } from '../dtos/seo-query.dto';
import { sortFunction } from 'src/shared/utils/sort-utils';
import { SeoDto } from '../dtos/seo.dto';

@Injectable()
export class SeoService {
  constructor(@InjectModel(Seo.name) private readonly seoModel: Model<Seo>) {}

  async findAll(queryParams: SeoQueryDto, selectObject = {}) {
    const { limit = 10, page = 1, url } = queryParams;

    const query: any = {};

    if (url) query.url = { $regex: url, $option: 'i' };

    const sortObject = sortFunction(queryParams?.sort);

    const Seos = await this.seoModel
      .find(query)
      .skip(page - 1)
      .limit(limit)
      .sort(sortObject)
      .select(selectObject)
      .exec();

    const count = await this.seoModel.countDocuments(query);

    return { count, Seos };
  }

  async findOne(id: string, selectedObject = {}) {
    const seo = await this.seoModel
      .findOne({ _id: id })
      .select(selectedObject)
      .exec();

    if (seo) {
      return seo;
    } else {
      throw new NotFoundException('یافت نشد');
    }
  }

  async findOneWithUrl(url: string, selectedObject = {}) {
    console.log(url);

    const seo = await this.seoModel
      .findOne({ url: url })
      .select(selectedObject)
      .exec();

    if (seo) {
      return seo;
    } else {
      throw new NotFoundException('یافت نشد');
    }
  }

  async create(body: SeoDto) {
    const newSeo = new this.seoModel(body);
    await newSeo.save();
    return newSeo;
  }

  async update(id: string, body: SeoDto) {
    return await this.seoModel.findByIdAndUpdate(id, body, { new: true });
  }

  async delete(id: string) {
    const seo = await this.findOne(id);

    await seo.deleteOne();
    return seo;
  }
}
