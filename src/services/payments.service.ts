import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: string;
  buyerId: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: string;
  message?: string;
}

@Injectable()
export class PaymentsService {
  private readonly paymentsServiceUrl =
    process.env.PAYMENTS_SERVICE_URL || 'http://localhost:3004';

  constructor(private readonly httpService: HttpService) {}

  async processPayment(
    paymentRequest: PaymentRequest,
  ): Promise<PaymentResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.paymentsServiceUrl}/payments/process`,
          paymentRequest,
        ),
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new HttpException(
          error.response.data.message || 'Payment failed',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Payment service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
