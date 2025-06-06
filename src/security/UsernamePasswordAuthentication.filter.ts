import {
  HttpException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from '../interface/auth/auth.interface';
import { User } from '@prisma/client';
import { UserService } from 'src/service/User.service';
import { UserContext } from 'src/security/UserContext';
import { match } from 'src/utils/PasswordEncoder.util';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import { number } from 'zod';
import e from 'express';

@Injectable()
export class UsernamePasswordAuthentication implements Auth {
  constructor(
    private userService: UserService,
    private jwtservice: JwtService,
  ) {}

  async authenticate(context: UserContext): Promise<UserContext> {
    // #1 sanitize user data
    const email: string = context.email.trim().toLowerCase();
    const password = context.password;

    // #2 load user

    const user: User = await this.userService.loadUserDetail(email);

    // #3 compare password
    if (user != null && (await match(password, user.password))) {
      // #4 authenticate if match else throw unauthorize request
      Logger.log(`User ${user.email} authenticated successfully.`);

      // create token, and attarch to user reponse.
      const authenticated = new UserContext(user.email, '', user.role, true);

      const access_token: string =
        await this.generateJwtAccessToken(authenticated);
      const refresh_token: string =
        await this.generateJwtRefreshToken(authenticated);
      authenticated.setAccess_token = access_token;
      authenticated.setRefresh_token = refresh_token;
      // #5 return user context
      return authenticated;
    } else {
      throw new UnauthorizedException(
        'Invalid credentials, email or password is incorrect',
      );
    }
  }

  async generateJwtAccessToken(authenticated: UserContext): Promise<string> {
    let token: string = await this.jwtservice.signAsync(
      {
        subject: authenticated.email,
        role: authenticated.authorities,
      },
      {
        expiresIn: process.env.JWT_EXPIRATION_ACCESS,
      },
    );

    return token;
  }
  async generateJwtRefreshToken(authenticated: UserContext): Promise<string> {
    let token: string = await this.jwtservice.signAsync(
      {
        subject: authenticated.email,
        role: authenticated.authorities,
      },
      { expiresIn: process.env.JWT_EXPIRATION_REFRESH },
    );

    return token;
  }
}
