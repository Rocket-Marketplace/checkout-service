import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CircuitBreakerService } from '../common/circuit-breaker/circuit-breaker.service';

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

  constructor(
    private readonly httpService: HttpService,
    private readonly circuitBreakerService: CircuitBreakerService,
  ) {}

  async processPayment(
    paymentRequest: PaymentRequest,
  ): Promise<PaymentResponse> {
    return this.circuitBreakerService.executeWithCircuitBreaker(
      async () => {
        const response = await firstValueFrom(
          this.httpService.post(
            `${this.paymentsServiceUrl}/payments/process`,
            paymentRequest,
          ),
        );
        return response.data;
      },
      async () => {
        throw new HttpException('Payment service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      },
      `processPayment-${paymentRequest.orderId}`
    );
  }
}
