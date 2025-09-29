import { Injectable, Logger } from '@nestjs/common';
import { MessagingClientService } from './messaging-client.service';

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

  constructor(private readonly messagingClientService: MessagingClientService) {}

  async publishPaymentOrder(paymentOrder: PaymentOrderMessage): Promise<void> {
    this.logger.log(`Publishing payment order for orderId: ${paymentOrder.orderId}`);
    
    await this.messagingClientService.publishMessage(
      this.ROUTING_KEY,
      'payment_order',
      paymentOrder,
      'checkout-service',
      'payments-service'
    );
  }
}
