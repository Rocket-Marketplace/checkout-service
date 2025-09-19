import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from '../common/dto/create-order.dto';
import { ProductsService } from '../services/products.service';
import { PaymentsService } from '../services/payments.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly productsService: ProductsService,
    private readonly paymentsService: PaymentsService,
    private readonly cartService: CartService,
  ) {}

  async createOrder(
    buyerId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const { items, shippingAddress, billingAddress, paymentMethod, notes } =
      createOrderDto;

    const productIds = items.map((item) => item.productId);
    const products = await this.productsService.validateProducts(productIds);

    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (!product.isActive) {
        throw new BadRequestException(
          `Product ${product.name} is not available`,
        );
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}`,
        );
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      const orderItem = this.orderItemRepository.create({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity: item.quantity,
        totalPrice: itemTotal,
        sellerId: product.sellerId,
      });

      orderItems.push(orderItem);
    }

    const order = this.orderRepository.create({
      buyerId,
      status: OrderStatus.PENDING,
      totalAmount,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
    });

    const savedOrder = await this.orderRepository.save(order);

    for (const orderItem of orderItems) {
      orderItem.orderId = savedOrder.id;
      await this.orderItemRepository.save(orderItem);
    }

    try {
      const paymentResult = await this.paymentsService.processPayment({
        orderId: savedOrder.id,
        amount: totalAmount,
        paymentMethod,
        buyerId,
      });

      savedOrder.paymentId = paymentResult.paymentId;
      savedOrder.paymentStatus = paymentResult.status;
      savedOrder.status = OrderStatus.CONFIRMED;

      await this.orderRepository.save(savedOrder);

      for (const item of items) {
        await this.productsService.updateStock(item.productId, item.quantity);
      }

      await this.cartService.clearCart(buyerId);

      return await this.findOne(savedOrder.id);
    } catch (error) {
      savedOrder.status = OrderStatus.CANCELLED;
      await this.orderRepository.save(savedOrder);
      throw error;
    }
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByBuyer(buyerId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { buyerId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return await this.orderRepository.save(order);
  }

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<Order> {
    const order = await this.findOne(id);
    order.paymentStatus = paymentStatus;
    return await this.orderRepository.save(order);
  }
}
