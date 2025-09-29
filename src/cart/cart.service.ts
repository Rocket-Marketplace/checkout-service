import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { AddToCartDto } from '../common/dto/add-to-cart.dto';
import { UpdateCartDto } from '../common/dto/update-cart.dto';
import { CheckoutDto } from '../common/dto/checkout.dto';
import { ProductsService } from '../services/products.service';
import { PaymentQueueService } from '../events/payment-queue.service';
import * as crypto from 'crypto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly productsService: ProductsService,
    private readonly paymentQueueService: PaymentQueueService,
  ) {}

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const { productId, quantity } = addToCartDto;

    const product = await this.productsService.getProduct(productId);

    if (!product.isActive) {
      throw new BadRequestException('Product is not available');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const existingCartItem = await this.cartRepository.findOne({
      where: { userId, productId },
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      return await this.cartRepository.save(existingCartItem);
    }

    const cartItem = this.cartRepository.create({
      userId,
      productId,
      productName: product.name,
      productPrice: product.price,
      quantity,
      sellerId: product.sellerId,
    });

    return await this.cartRepository.save(cartItem);
  }

  async getCart(userId: string): Promise<Cart[]> {
    return await this.cartRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateCartItem(
    userId: string,
    productId: string,
    updateCartDto: UpdateCartDto,
  ): Promise<Cart> {
    const cartItem = await this.cartRepository.findOne({
      where: { userId, productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const product = await this.productsService.getProduct(productId);

    if (product.stock < updateCartDto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    cartItem.quantity = updateCartDto.quantity;
    return await this.cartRepository.save(cartItem);
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    const result = await this.cartRepository.delete({ userId, productId });

    if (result.affected === 0) {
      throw new NotFoundException('Cart item not found');
    }
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartRepository.delete({ userId });
  }

  async getCartTotal(
    userId: string,
  ): Promise<{ total: number; items: Cart[] }> {
    const items = await this.getCart(userId);
    const total = items.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0,
    );

    return { total, items };
  }

  async processCheckout(userId: string, checkoutDto: CheckoutDto): Promise<{ orderId: string; message: string }> {
    const cartItems = await this.getCart(userId);
    
    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Generate order ID
    const orderId = crypto.randomUUID();

    // Calculate total amount
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0,
    );

    // Prepare payment order message
    const paymentOrderMessage = {
      orderId,
      userId,
      amount: totalAmount,
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.productPrice,
      })),
      paymentMethod: checkoutDto.paymentMethod,
      description: checkoutDto.notes || `Order ${orderId}`,
    };

    // Send payment order to queue
    await this.paymentQueueService.publishPaymentOrder(paymentOrderMessage);

    // Clear cart after successful checkout
    await this.clearCart(userId);

    return {
      orderId,
      message: 'Checkout processed successfully. Payment order created.',
    };
  }
}
