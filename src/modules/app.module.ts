import { Global, Module } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { ProductController } from 'src/controller/product.controller';
import { ProductModule } from './product.module';
import { PrismaModule } from './prisma.module';
import { UserModule } from './User.module';
import { AuthRequestFilterMiddleware } from 'src/middleware/auth-request-filter/auth-request-filter.middleware';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/gaurd/auth/auth.guard';
import { AuthProviderModule } from './auth/authProvider.module';
import { UsernamePasswordAuthentication } from 'src/security/UsernamePasswordAuthentication.filter';
import { UserService } from 'src/service/User.service';

@Module({
  imports: [PrismaModule, UserModule, AuthProviderModule, ProductModule],
  providers: [],
})
export class AppModule {}
