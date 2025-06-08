import { PageRequest } from 'src/controller/product.controller';
import { OrderDto } from 'src/dtos/Order.dto';
import { OrderEntity } from 'src/entities/Order.entity';

export interface OrdersInterface {
  createOrder(orderDto: OrderDto, userEmail: string): Promise<OrderEntity>;

  findUserOrders(
    filter: PageRequest,
    userEmail: string,
  ): Promise<Array<OrderEntity>>;

  findOrderById(orderId: number, userEmail: string): Promise<OrderEntity>;

  findAll(filter?: PageRequest): Promise<Array<OrderEntity>>;
}
