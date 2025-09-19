import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @ApiProperty({ description: 'Order ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Buyer ID' })
  @Column({ type: 'uuid' })
  buyerId: string;

  @ApiProperty({ description: 'Order status', enum: OrderStatus })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ description: 'Order total amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @ApiProperty({ description: 'Shipping address' })
  @Column({ type: 'text' })
  shippingAddress: string;

  @ApiProperty({ description: 'Billing address' })
  @Column({ type: 'text' })
  billingAddress: string;

  @ApiProperty({ description: 'Payment method' })
  @Column({ type: 'varchar', length: 50 })
  paymentMethod: string;

  @ApiProperty({ description: 'Payment status' })
  @Column({ type: 'varchar', length: 50, default: 'pending' })
  paymentStatus: string;

  @ApiProperty({ description: 'Payment ID from payment service' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentId: string | null;

  @ApiProperty({ description: 'Shipping cost' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingCost: number;

  @ApiProperty({ description: 'Tax amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @ApiProperty({ description: 'Discount amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @ApiProperty({ description: 'Order notes' })
  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ApiProperty({ description: 'Tracking number' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  trackingNumber: string | null;

  @ApiProperty({ description: 'Estimated delivery date' })
  @Column({ type: 'date', nullable: true })
  estimatedDeliveryDate: Date | null;

  @ApiProperty({ description: 'Order items' })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  updatedAt: Date;
}
