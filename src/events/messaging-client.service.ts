import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface MessagePayload {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  source: string;
  target?: string;
}

@Injectable()
export class MessagingClientService {
  private readonly logger = new Logger(MessagingClientService.name);
  private readonly messagingServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.messagingServiceUrl = this.configService.get<string>(
      'MESSAGING_SERVICE_URL', 
      'http://messaging-service:3005'
    );
  }

  async publishMessage(
    routingKey: string, 
    messageType: string, 
    data: any, 
    source: string,
    target?: string
  ): Promise<void> {
    try {
      const message: MessagePayload = {
        id: this.generateMessageId(),
        type: messageType,
        data,
        timestamp: new Date(),
        source,
        target,
      };

      await firstValueFrom(
        this.httpService.post(`${this.messagingServiceUrl}/messaging/publish`, {
          routingKey,
          message,
        })
      );

      this.logger.log(`Message published: ${routingKey} - ${message.id}`);
    } catch (error) {
      this.logger.error('Failed to publish message:', error);
      throw error;
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
