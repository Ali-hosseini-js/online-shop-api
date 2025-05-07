import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Ticket,
  TicketInterface,
  TicketStatus,
} from '../schemas/ticket.schema';
import {
  TicketMessage,
  TicketMessageInterface,
} from '../schemas/ticket-message.schema';
import { Model } from 'mongoose';
import { TicketMessageDto } from '../dtos/ticket-message.dto';
import { sortFunction } from 'src/shared/utils/sort-utils';
import { TicketQueryDto } from '../dtos/ticket-query.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketInterface>,
    @InjectModel(TicketMessage.name)
    private readonly ticketMessageModel: Model<TicketMessageInterface>,
  ) {}

  async createNewTicket(title: string, user: string) {
    const newTicket = new this.ticketModel({
      title: title,
      user: user,
      status: TicketStatus.Pending,
    });

    await newTicket.save();
    return newTicket;
  }

  async createTicketMessage(
    body: TicketMessageDto,
    user: string,
    status?: TicketStatus,
  ) {
    const newTicketMessage = new this.ticketMessageModel({
      ...body,
      user: user,
    });

    await newTicketMessage.save();

    if (status) {
      await this.changeTicketStatus(body.ticket, status);
    }

    return newTicketMessage;
  }

  async findOneTicket(id: string) {
    const ticket = await this.ticketModel
      .findOne({ _id: id })
      .populate('user', { firstName: 1, lastName: 1 })
      .exec();

    if (ticket) {
      const messages = await this.ticketMessageModel
        .find({
          ticket: ticket._id.toString(),
        })
        .populate('user', { firstName: 1, lastName: 1 })
        .sort({ createdAt: 1 })
        .exec();
      return { ticket, messages };
    } else {
      throw new NotFoundException();
    }
  }

  async findAll(queryParams: TicketQueryDto, selectObject: any = { __v: 0 }) {
    const { limit = 10, page = 1, title, user, status } = queryParams;

    const query: any = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (user) query.user = user;
    if (status) query.status = status;

    const sortObject = sortFunction(queryParams?.sort);

    const tickets = await this.ticketModel
      .find(query)
      .skip(page - 1)
      .limit(limit)
      .populate('user', { firstName: 1, lastName: 1 })
      .sort(sortObject)
      .select(selectObject)
      .exec();

    const count = await this.ticketModel.countDocuments(query);

    return { count, tickets };
  }

  async changeTicketStatus(id: string, status: TicketStatus) {
    const ticket = await this.ticketModel.findOne({ _id: id }).exec();

    if (ticket) {
      ticket.status = status;
      await ticket.save();
    } else {
      throw new NotFoundException('موردی یافت نشد');
    }
  }
}
