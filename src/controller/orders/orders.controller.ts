import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { OrderDto } from 'src/dtos/Order.dto';
import { OrderEntity } from 'src/entities/Order.entity';
import { OrdersService } from 'src/service/orders/orders.service';
import { PageRequest } from '../product.controller';
import { Order } from '@prisma/client';
import { date } from 'zod';
import { Principal } from 'src/security/Principal.type';

@Controller('api')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  //create a new order
  @Post('/orders')
  async createOrder(
    @Body() orderDto: OrderDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const userEmail = req.user.getUsername;
    const userRole = req.user.getRole;

    const order: OrderEntity = await this.orderService.createOrder(
      orderDto,
      userEmail,
    );
    return res.status(HttpStatus.CREATED).json({
      data: order,
      message: 'order created',
    });
  }

  //list  user orders

  @Get('/orders')
  async ListUserOrders(
    @Req() req: Request,
    @Res() res: Response,
    @Query('filter') filter: string,
  ): Promise<Response> {
    const userEmail = req.user.getUsername;
    const pageRequest: PageRequest = JSON.parse(filter);

    const orderList = await this.orderService.findUserOrders(
      pageRequest,
      userEmail,
    );

    return res.json(orderList);
  }
  
  @Get('/orders/:id')
  async findOne(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    id = parseInt(id.toString());
    if (isNaN(id))
      throw new BadRequestException('pleaseprovide a valide order id ');
    const userEmail: string = req.user.getUsername;
    const order: OrderEntity = await this.orderService.findOrderById(
      id,
      userEmail,
    );
    return res.status(HttpStatus.OK).json({
      data: order,
      message: 'successful',
    });
  }

  @Get('/admin/orders')
  async getAllOrders(
    @Req() req: Request,
    @Res() res: Response,
    @Query('filter') filter: string,
  ): Promise<Response> {
    const user: Principal = req.user;
    const pageRequest: PageRequest = JSON.parse(filter);
    const orders: OrderEntity[] = await this.orderService.findAll(pageRequest);

    return res.status(HttpStatus.OK).json({
      message: 'successful',
      data: orders,
    });
  }
}
