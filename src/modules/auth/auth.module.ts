import { Module } from '@nestjs/common';
import { UsernamePasswordAuthentication } from 'src/security/UsernamePasswordAuthentication.filter';
import { UserService } from 'src/service/User.service';
import { UserModule } from '../User.module';
import { AuthProviderModule } from './authProvider.module';
import { AuthGuard } from 'src/gaurd/auth/auth.guard';

@Module({
  imports: [UserModule, AuthProviderModule],
  providers: [],
  exports: [AuthGuard],
})
export class AuthModule {}
