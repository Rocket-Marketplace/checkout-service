import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  ValidateNested,
  IsUUID,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity', example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Order items', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Shipping address',
    example: '123 Main St, New York, NY 10001',
  })
  @IsString()
  shippingAddress: string;

  @ApiProperty({
    description: 'Billing address',
    example: '123 Main St, New York, NY 10001',
  })
  @IsString()
  billingAddress: string;

  @ApiProperty({ description: 'Payment method', example: 'credit_card' })
  @IsString()
  paymentMethod: string;

  @ApiProperty({
    description: 'Order notes',
    example: 'Please deliver after 5 PM',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
