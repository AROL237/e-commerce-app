import { User } from './User.entity';
import { Product } from '@prisma/client';

export class Admin extends User {
  access_code: string;
}
