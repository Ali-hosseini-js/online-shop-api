import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InventoryRecord } from '../schemas/inventory-record.schema';
import { Model } from 'mongoose';
import { InventoryRecordDto } from '../dtos/inventory-record.dto';
import { sortFunction } from 'src/shared/utils/sort-utils';
import { InventoryRecordQueryDto } from '../dtos/inventory-record-query.dto';

@Injectable()
export class InventoryRecordService {
  constructor(
    @InjectModel(InventoryRecord.name)
    private readonly inventoryRecordModel: Model<InventoryRecord>,
  ) {}

  async createRecord(body: InventoryRecordDto) {
    const newInventoryRecord = new this.inventoryRecordModel(body);

    await newInventoryRecord.save();

    return newInventoryRecord;
  }

  async findAll(
    queryParams: InventoryRecordQueryDto,
    selectObject: any = { __v: 0 },
  ) {
    const { limit = 5, page = 1, sort, product } = queryParams;

    const query: any = {};

    if (product) {
      query.product = product;
    }

    const sortObject = sortFunction(sort);

    const InventoryRecords = await this.inventoryRecordModel
      .find(query)
      .populate('product', { title: 1 })
      .sort(sortObject)
      .select(selectObject)
      .skip(page - 1)
      .limit(limit)
      .exec();

    const count = await this.inventoryRecordModel.countDocuments(query);

    return { count, InventoryRecords };
  }
}
