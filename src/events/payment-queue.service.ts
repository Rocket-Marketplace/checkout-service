import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

export interface PaymentOrderMessage {
  orderId: string;
  userId: string;
  amount: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: string;
  description?: string;
}

@Injectable()
export class PaymentQueueService {
  private readonly logger = new Logger(PaymentQueueService.name);
  private readonly ROUTING_KEY = 'payment.order';
  private readonly EXCHANGE = 'payments';

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async publishPaymentOrder(paymentOrder: PaymentOrderMessage): Promise<void> {
    this.logger.log(`Publishing payment order for orderId: ${paymentOrder.orderId}`);
    
    try {
      await this.rabbitMQService.publishMessage(
        this.EXCHANGE,
        this.ROUTING_KEY,
        paymentOrder
      );
      this.logger.log(`Payment order published successfully: ${paymentOrder.orderId}`);
    } catch (error) {
      this.logger.error(`Failed to publish payment order: ${paymentOrder.orderId}`, error);
      throw error;
    }
  }
}
