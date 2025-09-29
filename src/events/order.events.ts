export enum OrderEventType {
  ORDER_CREATED = 'order.created',
  ORDER_CONFIRMED = 'order.confirmed',
  ORDER_CANCELLED = 'order.cancelled',
  ORDER_SHIPPED = 'order.shipped',
  ORDER_DELIVERED = 'order.delivered',
}

export interface OrderCreatedEvent {
  orderId: string;
  buyerId: string;
  sellerIds: string[];
  totalAmount: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    sellerId: string;
  }>;
  createdAt: Date;
}

export interface OrderConfirmedEvent {
  orderId: string;
  buyerId: string;
  sellerIds: string[];
  totalAmount: number;
  paymentId: string;
  confirmedAt: Date;
}

export interface OrderCancelledEvent {
  orderId: string;
  buyerId: string;
  sellerIds: string[];
  reason: string;
  cancelledAt: Date;
}

export interface OrderShippedEvent {
  orderId: string;
  buyerId: string;
  sellerId: string;
  trackingNumber: string;
  shippedAt: Date;
}

export interface OrderDeliveredEvent {
  orderId: string;
  buyerId: string;
  sellerId: string;
  deliveredAt: Date;
}

