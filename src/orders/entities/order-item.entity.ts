import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @ApiProperty({ description: 'Order item ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Order ID' })
  @Column({ type: 'uuid' })
  orderId: string;

  @ApiProperty({ description: 'Product ID' })
  @Column({ type: 'uuid' })
  productId: string;

  @ApiProperty({ description: 'Product name' })
  @Column({ type: 'varchar', length: 255 })
  productName: string;

  @ApiProperty({ description: 'Product price at time of purchase' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  productPrice: number;

  @ApiProperty({ description: 'Quantity ordered' })
  @Column({ type: 'int' })
  quantity: number;

  @ApiProperty({ description: 'Total price for this item' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @ApiProperty({ description: 'Seller ID' })
  @Column({ type: 'uuid' })
  sellerId: string;

  @ApiProperty({ description: 'Order reference' })
  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
