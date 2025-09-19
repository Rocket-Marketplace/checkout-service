import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductsService } from '../services/products.service';
import { PaymentsService } from '../services/payments.service';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Cart]), HttpModule],
  controllers: [OrdersController],
  providers: [OrdersService, ProductsService, PaymentsService, CartService],
  exports: [OrdersService],
})
export class OrdersModule {}
