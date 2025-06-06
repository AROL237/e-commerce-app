import { User } from '@prisma/client';

export interface UserDetailInterface {
  loadUserDetail(email: string): Promise<User>;
}
