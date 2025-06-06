import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth } from 'src/interface/auth/auth.interface';
import { UserContext } from './UserContext';
import { JwtService } from '@nestjs/jwt';
import { Principal } from './Principal.type';
import { User } from 'src/entities/User.entity';

@Injectable()
export class JwtAuthenticationFilter implements Auth {
  constructor(private jwtService: JwtService) {}
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
        const payload = await this.jwtService.decode(context);

        // Create a new UserContext with the payload data
        return new UserContext(payload.getUsername, '', payload.getRole, true);
      } catch (error: any) {
        throw new UnauthorizedException(error);
      }
    } else
      throw new UnauthorizedException(
        'Invalid context type for JWT authentication. Expected token string.',
      );
  }
}
