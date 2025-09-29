import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      const rabbitmqUrl = this.configService.get<string>('RABBITMQ_URL', 'amqp://admin:admin@localhost:5672');
      
      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      
      this.logger.log('Connected to RabbitMQ');
      
      // Handle connection errors
      this.connection.on('error', (err) => {
        this.logger.error('RabbitMQ connection error:', err);
      });
      
      this.connection.on('close', () => {
        this.logger.warn('RabbitMQ connection closed');
      });
    } catch (error) {
      this.logger.warn('Failed to connect to RabbitMQ, continuing without message queue:', error.message);
      // Don't throw error, just log warning and continue
    }
  }

  private async disconnect() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.logger.log('Disconnected from RabbitMQ');
    } catch (error) {
      this.logger.error('Error disconnecting from RabbitMQ:', error);
    }
  }

  async publishMessage(exchange: string, routingKey: string, message: any): Promise<void> {
    try {
      if (!this.channel) {
        this.logger.warn('RabbitMQ channel not available, skipping message publish');
        return;
      }

      // Ensure exchange exists
      await this.channel.assertExchange(exchange, 'topic', { durable: true });
      
      const messageBuffer = Buffer.from(JSON.stringify(message));
      
      const published = this.channel.publish(exchange, routingKey, messageBuffer, {
        persistent: true,
        timestamp: Date.now(),
      });

      if (!published) {
        throw new Error('Failed to publish message to RabbitMQ');
      }

      this.logger.debug(`Message published to ${exchange}:${routingKey}`);
    } catch (error) {
      this.logger.error('Failed to publish message:', error);
      // Don't throw error, just log it
    }
  }

  async subscribeToQueue(
    queueName: string,
    exchange: string,
    routingKey: string,
    callback: (message: any) => Promise<void>
  ): Promise<void> {
    try {
      if (!this.channel) {
        throw new Error('RabbitMQ channel not available');
      }

      // Ensure exchange exists
      await this.channel.assertExchange(exchange, 'topic', { durable: true });
      
      // Create queue
      const queue = await this.channel.assertQueue(queueName, { durable: true });
      
      // Bind queue to exchange
      await this.channel.bindQueue(queue.queue, exchange, routingKey);
      
      // Set prefetch to 1 to process messages one at a time
      await this.channel.prefetch(1);
      
      // Consume messages
      await this.channel.consume(queue.queue, async (msg) => {
        if (msg) {
          try {
            const message = JSON.parse(msg.content.toString());
            await callback(message);
            this.channel.ack(msg);
            this.logger.debug(`Message processed from queue: ${queueName}`);
          } catch (error) {
            this.logger.error(`Error processing message from queue ${queueName}:`, error);
            this.channel.nack(msg, false, false); // Reject and don't requeue
          }
        }
      });

      this.logger.log(`Subscribed to queue: ${queueName} with routing key: ${routingKey}`);
    } catch (error) {
      this.logger.error('Failed to subscribe to queue:', error);
      throw error;
    }
  }

  getChannel(): amqp.Channel {
    return this.channel;
  }

  getConnection(): amqp.Connection {
    return this.connection;
  }
}

