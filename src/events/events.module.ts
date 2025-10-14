import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { PaymentQueueService } from './payment-queue.service';

@Module({
  providers: [RabbitMQService, PaymentQueueService],
  exports: [PaymentQueueService],
})
export class EventsModule {}