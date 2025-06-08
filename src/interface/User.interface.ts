import { UserDtoRequest } from 'src/dtos/user/UserDtoRequest';
import { User } from 'src/entities/User.entity';
import { User as PrismaUser } from '@prisma/client';
import { nullable } from 'zod';

export interface UserServiceInterface {
  findAll(): unknown;
  findOne(arg0: number): Promise<User | null>;
  remove(arg0: number): unknown;
  createUser(userDto: UserDtoRequest): Promise<User>;
  createAdmin(adminDto: UserDtoRequest): Promise<User>;
  findByEmail(email: string): Promise<any>;
}
