import { Module } from '@nestjs/common';
import { UsernamePasswordAuthentication } from 'src/security/UsernamePasswordAuthentication.filter';
import { UserService } from 'src/service/User.service';
import { UserModule } from '../User.module';
import { AuthGuard } from 'src/gaurd/auth/auth.guard';
import { JwtAuthenticationFilter } from 'src/security/JwtAuthentication.filter';
import { JwtModule } from '@nestjs/jwt';
import { HOST_METADATA } from '@nestjs/common/constants';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        algorithm: 'HS256',
        
      },
    }),
  ],
  providers: [
    UsernamePasswordAuthentication,
    UserService,
    AuthGuard,
    JwtAuthenticationFilter,
  ],
})
export class AuthProviderModule {}
