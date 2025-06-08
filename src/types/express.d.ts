// src/types/express.d.ts
import { Role } from '@prisma/client';
import { Request } from 'express';
import { Principal } from 'src/security/Principal.type';
import { UserContext } from 'src/security/UserContext';

declare module 'express' {
  interface Request {
    user: Principal; // You can replace `any` with a proper type like `JwtPayload`
    access_token?: string;
    refresh_token?: string;
  }
}
