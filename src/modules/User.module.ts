import { Module } from '@nestjs/common';
import { UserController } from 'src/controller/userController';
import { UserService } from 'src/service/User.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
