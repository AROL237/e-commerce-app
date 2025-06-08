import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth } from 'src/interface/auth.interface';
import { UserContext } from './UserContext';
import { JwtService } from '@nestjs/jwt';
import { Principal } from './Principal.type';
import { UserService } from 'src/service/User.service';
import { Role, User } from '@prisma/client';

@Injectable()
export class JwtAuthenticationFilter implements Auth {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  // Implementation of JWT authentication
  async authenticate(context: UserContext | string): Promise<UserContext> {
    if (typeof context === 'string') {
      // verify validity of the token
      try {
        await this.jwtService.verifyAsync(context, {
          algorithms: ['HS256'],
          secret: process.env.JWT_SECRET,
        });
        // Decode the token to extract payload
        const payload: {
          subject: string;
          role: string | Array<string> | Array<Role>;
        } = await this.jwtService.decode(context);
        const subject: string = payload.subject;
        const user: User | null =
          await this.userService.loadUserDetail(subject);
        // if (user)
        // Create a new UserContext with the payload data
        return new UserContext(user.email, '', user.role, true);
      } catch (error: any) {
        throw new UnauthorizedException();
      }
    } else
      throw new UnauthorizedException(
        'Invalid context type for JWT authentication. Expected token string.',
      );
  }
}
