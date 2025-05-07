import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { NewTicketDto } from 'src/ticket/dtos/new-ticket.dto';

@Injectable()
export class TicketMessagePipe implements PipeTransform {
  transform(value: NewTicketDto, metadata: ArgumentMetadata) {
    if (!value?.content && !value?.image) {
      throw new BadRequestException('هر پیام باید حاوی یک متن یا تصویر باشد');
    }
    return value;
  }
}
