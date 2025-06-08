import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderEntity } from 'src/entities/Order.entity';
import { Order, User } from '@prisma/client';
import { UserService } from '../User.service';
import { OrderDto } from 'src/dtos/Order.dto';
import { PageRequest } from 'src/controller/product.controller';
import { OrdersInterface } from 'src/interface/Orders.interface';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { NotFoundError } from 'rxjs';

@Injectable()
export class OrdersService implements OrdersInterface {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  //create user order

  async createOrder(
    orderDto: OrderDto,
    userEmail: string,
  ): Promise<OrderEntity> {
    try {
      const user: User = await this.userService.findByEmail(userEmail);
      const order = await this.prismaService.order.create({
        data: {
          status: orderDto.status,
          userId: user.id,
          total: orderDto.total,
          orderItems: {
            create: orderDto.orderedItems,
          },
        },
        include: {
          orderItems: true,
        },
      });

      return OrderEntity.prototype.convertToEntity(order);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ConflictException('Duplicate entry.');
        if (error.code === 'P2003')
          throw new BadRequestException('Invalid foreign key.');
      } else if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Validation error.');
      } else if (error instanceof PrismaClientUnknownRequestError) {
        throw new InternalServerErrorException('Unknown database error.');
      }
      throw error;
    }
  }

  async findOrderById(
    orderId: number,
    userEmail: string,
  ): Promise<OrderEntity> {
    try {
      const user: User = await this.userService.findByEmail(userEmail);
      const order: Order | null = await this.prismaService.order.findUnique({
        where: { id: orderId, user: user },
        include: { orderItems: true },
      });
      if (order === null)
        throw new NotFoundException('order not found id :' + orderId);
      return OrderEntity.prototype.convertToEntity(order);
    } catch (error) {
      throw error;
    }
  }

  async findUserOrders(
    filter: PageRequest,
    userEmail: string,
  ): Promise<Array<OrderEntity>> {
    try {
      const page = filter.page ?? 1;
      const limit = filter.limit ?? 10;
      const skip = (page - 1) * limit;
      const user: User = await this.userService.findByEmail(userEmail);

      const orderList: Array<Order> = await this.prismaService.order.findMany({
        skip,
        take: limit,
        orderBy: filter.orderBy,
        include: { orderItems: true },
        where: {
          userId: user.id,
        },
      });

      return orderList.map((order) =>
        OrderEntity.prototype.convertToEntity(order),
      );
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Validation error.');
      }
      throw error;
    }
  }

  async findAll(filter: PageRequest): Promise<Array<OrderEntity>> {
    try {
      const page = filter.page ?? 1;
      const limit = filter.limit ?? 10;
      const skip = (page - 1) * limit;

      const listOfOrders = await this.prismaService.order.findMany({
        skip,
        take: limit,
        orderBy: filter.orderBy,
        include: { _count: true, orderItems: true },
      });

      return listOfOrders.map((order) =>
        OrderEntity.prototype.convertToEntity(order),
      );
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Validation error.');
      }
      throw error;
    }
  }
}
