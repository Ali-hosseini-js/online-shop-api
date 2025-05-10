import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { OrderService } from '../services/order.service';

@Processor('callback-queue')
export class CallbackProcessor {
  constructor(private readonly orderService: OrderService) {}
  @Process()
  async startJob(job: Job) {
    console.log('CallbackProcessor');
    await this.orderService.callback(job.data.refId);
  }
}
