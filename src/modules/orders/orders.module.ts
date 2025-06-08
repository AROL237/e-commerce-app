import { Module } from '@nestjs/common';
import { OrdersController } from 'src/controller/orders/orders.controller';
import { OrdersService } from 'src/service/orders/orders.service';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { PrismaModule } from '../prisma.module';
import { UserModule } from '../User.module';
import { UserService } from 'src/service/User.service';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, UserService],
})
export class OrdersModule {}
