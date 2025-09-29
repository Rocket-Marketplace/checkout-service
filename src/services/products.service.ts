import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CircuitBreakerService } from '../common/circuit-breaker/circuit-breaker.service';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sellerId: string;
  isActive: boolean;
}

@Injectable()
export class ProductsService {
  private readonly productsServiceUrl =
    process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3001';

  constructor(
    private readonly httpService: HttpService,
    private readonly circuitBreakerService: CircuitBreakerService,
  ) {}

  async getProduct(productId: string): Promise<Product> {
    return this.circuitBreakerService.executeWithCircuitBreaker(
      async () => {
        const response = await firstValueFrom(
          this.httpService.get(
            `${this.productsServiceUrl}/products/${productId}`,
          ),
        );
        return response.data;
      },
      async () => {
        throw new HttpException('Products service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      },
      `getProduct-${productId}`
    );
  }

  async validateProducts(productIds: string[]): Promise<Product[]> {
    const products = await Promise.all(
      productIds.map((id) => this.getProduct(id)),
    );
    return products;
  }

  async updateStock(productId: string, quantity: number): Promise<void> {
    return this.circuitBreakerService.executeWithCircuitBreaker(
      async () => {
        const response = await firstValueFrom(
          this.httpService.patch(
            `${this.productsServiceUrl}/products/${productId}/stock`,
            {
              quantity: -quantity,
            },
          ),
        );
        return response.data;
      },
      async () => {
        throw new HttpException('Products service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      },
      `updateStock-${productId}`
    );
  }
}
