import { User } from '@prisma/client';
import { UserContext } from 'src/security/UserContext';

export interface Auth {
  authenticate(context: UserContext): Promise<UserContext> | undefined;
}
