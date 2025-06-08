import { Order, OrderItem, User } from '@prisma/client';

export class OrderEntity {
  id: number;
  userId: number;
  total: number;
  status: boolean;
  orderItems:
    | { id: number; productId: number; orderId: number; quantity: number }[]
    | undefined;

  //relations
  // orderItems: OrderItem[] | undefined;

  constructor(
    id: number,
    userId: number,
    status: boolean,
    total: number,
    orderItems?: Array<OrderItem>,
  ) {
    this.id = id;
    this.userId = userId;
    this.total = total;
    this.status = status;
    this.orderItems = orderItems;
  }

  public convertToEntity(order: any): OrderEntity {
    return new OrderEntity(
      order.id,
      order.userId,
      order.status,
      order.total,
      order.orderItems,
    );
  }
}
