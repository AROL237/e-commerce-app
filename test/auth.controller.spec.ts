import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../src/controller/userController';
import { UserService } from '../src/service/User.service';

describe('AuthController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
