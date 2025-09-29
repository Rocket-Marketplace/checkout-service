import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MessagingClientService } from './messaging-client.service';
import { PaymentQueueService } from './payment-queue.service';

@Module({
  imports: [HttpModule],
  providers: [MessagingClientService, PaymentQueueService],
  exports: [PaymentQueueService],
})
export class EventsModule {}