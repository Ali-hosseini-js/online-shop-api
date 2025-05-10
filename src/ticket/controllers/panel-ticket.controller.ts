import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TicketService } from '../services/ticket.service';
import { NewTicketDto } from '../dtos/new-ticket.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { TicketMessagePipe } from 'src/shared/pipes/ticket-message.pipe';
import { BodyIdPipe } from 'src/shared/pipes/body-id.pipe';
import { TicketMessageDto } from '../dtos/ticket-message.dto';
import { TicketQueryDto } from '../dtos/ticket-query.dto';
import { TicketStatus } from '../schemas/ticket.schema';

@ApiTags('Panel Ticket')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('panel/ticket')
export class PanelTicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  async createNewTicket(
    @Body(TicketMessagePipe) body: NewTicketDto,
    @User() user: string,
  ) {
    const ticket = await this.ticketService.createNewTicket(body.title, user);

    await this.ticketService.createTicketMessage(
      {
        content: body.content,
        image: body.image,
        ticket: ticket._id.toString(),
      },
      user,
    );

    return this.ticketService.findOneTicket(ticket._id.toString());
  }

  @Get()
  findAll(@Query() queryParams: TicketQueryDto) {
    return this.ticketService.findAll(queryParams);
  }

  @Get(':id')
  findOneTicket(@Param('id') id: string) {
    return this.ticketService.findOneTicket(id);
  }

  @Post('message')
  createTicketMessage(
    @Body(TicketMessagePipe, new BodyIdPipe(['ticket'])) body: TicketMessageDto,
    @User() user: string,
  ) {
    return this.ticketService.createTicketMessage(
      body,
      user,
      TicketStatus.Pending,
    );
  }
}
