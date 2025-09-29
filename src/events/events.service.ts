import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { OrderCreatedEvent, OrderConfirmedEvent, OrderCancelledEvent, OrderEventType } from './order.events';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  private readonly EXCHANGE_NAME = 'marketplace.events';

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async publishOrderCreated(event: OrderCreatedEvent): Promise<void> {
    try {
      await this.rabbitMQService.publishMessage(
        this.EXCHANGE_NAME,
        OrderEventType.ORDER_CREATED,
        event
      );
      this.logger.log(`Order created event published: ${event.orderId}`);
    } catch (error) {
      this.logger.error('Failed to publish order created event:', error);
      throw error;
    }
  }

  async publishOrderConfirmed(event: OrderConfirmedEvent): Promise<void> {
    try {
      await this.rabbitMQService.publishMessage(
        this.EXCHANGE_NAME,
        OrderEventType.ORDER_CONFIRMED,
        event
      );
      this.logger.log(`Order confirmed event published: ${event.orderId}`);
    } catch (error) {
      this.logger.error('Failed to publish order confirmed event:', error);
      throw error;
    }
  }

  async publishOrderCancelled(event: OrderCancelledEvent): Promise<void> {
    try {
      await this.rabbitMQService.publishMessage(
        this.EXCHANGE_NAME,
        OrderEventType.ORDER_CANCELLED,
        event
      );
      this.logger.log(`Order cancelled event published: ${event.orderId}`);
    } catch (error) {
      this.logger.error('Failed to publish order cancelled event:', error);
      throw error;
    }
  }
}
