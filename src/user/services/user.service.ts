import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserQueryDto } from '../dtos/user-query.dto';
import { sortFunction } from 'src/shared/utils/sort-utils';
import { UserDto } from '../dtos/user.dto';
import { async } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(queryParams: UserQueryDto, selectObject: any = { __v: 0 }) {
    const { limit = 5, page = 1, sort, lastName, mobile } = queryParams;

    const query: any = {};

    if (lastName) {
      query.lastName = { $regex: lastName, $options: 'i' };
    }

    if (mobile) {
      query.mobile = { $regex: mobile, $options: 'i' };
    }

    const sortObject = sortFunction(sort);

    const users = await this.userModel
      .find(query)
      .sort(sortObject)
      .select(selectObject)
      .skip(page - 1)
      .limit(limit)
      .exec();

    const count = await this.userModel.countDocuments(query);

    return { count, users };
  }

  async findOne(id: string, selectObject: any = { __v: 0 }) {
    const user = await this.userModel
      .findOne({ _id: id })
      .select(selectObject)
      .exec();
    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }

  async create(body: UserDto) {
    const newUser = new this.userModel(body);
    await newUser.save();
    return newUser;
  }

  async update(id: string, body: UserDto) {
    return await this.userModel.findByIdAndUpdate(id, body, { new: true });
  }

  async delete(id: string) {
    const user = await this.findOne(id);
    await user.deleteOne();
    return user;
  }
}
