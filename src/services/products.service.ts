import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

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

  constructor(private readonly httpService: HttpService) {}

  async getProduct(productId: string): Promise<Product> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.productsServiceUrl}/products/${productId}`,
        ),
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to fetch product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateProducts(productIds: string[]): Promise<Product[]> {
    const products = await Promise.all(
      productIds.map((id) => this.getProduct(id)),
    );
    return products;
  }

  async updateStock(productId: string, quantity: number): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.patch(
          `${this.productsServiceUrl}/products/${productId}/stock`,
          {
            quantity: -quantity,
          },
        ),
      );
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new HttpException('Insufficient stock', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Failed to update stock',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
