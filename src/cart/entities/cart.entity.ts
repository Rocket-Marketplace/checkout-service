import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('cart')
export class Cart {
  @ApiProperty({ description: 'Cart ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User ID' })
  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ description: 'Product ID' })
  @Column({ type: 'uuid' })
  productId: string;

  @ApiProperty({ description: 'Product name' })
  @Column({ type: 'varchar', length: 255 })
  productName: string;

  @ApiProperty({ description: 'Product price' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  productPrice: number;

  @ApiProperty({ description: 'Quantity' })
  @Column({ type: 'int' })
  quantity: number;

  @ApiProperty({ description: 'Seller ID' })
  @Column({ type: 'uuid' })
  sellerId: string;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  updatedAt: Date;
}
