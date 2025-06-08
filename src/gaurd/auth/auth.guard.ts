import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthenticationFilter } from 'src/security/JwtAuthentication.filter';
import { Principal } from 'src/security/Principal.type';
import { UserContext } from 'src/security/UserContext';
import { UsernamePasswordAuthentication } from 'src/security/UsernamePasswordAuthentication.filter';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userNamePasswordAuthenticaion: UsernamePasswordAuthentication,
    private jwtAuthenticationFilter: JwtAuthenticationFilter,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const urlpath = request.url;
    //open endpoint for unauthorized request
    // Allow registration without authentication
    if (urlpath == '/api/auth/register') return true;
    if (urlpath == '/api/auth/login') {
      const email = request.body.email.trim();
      const password = request.body.password;
      if (!email || !password) {
        Logger.error('Email or password is missing in the request body');
        return false; // Unauthorized access
      }
      const ctx = new UserContext(request.body.email, request.body.password);
      Logger.log(`user authentication request : ${ctx.email}`);
      const authenticated =
        await this.userNamePasswordAuthenticaion.authenticate(ctx);

      //setting authenticated user
      await this.SetPrincipalContext(authenticated, request);
      request.access_token = authenticated.access_token;
      request.refresh_token = authenticated.refresh_token;
      return true; // Allow access to login route
    } else {
      // For other routes, check if user is authenticated
      // token base authentication.
      const token: string | undefined = request.access_token;

      if (token) {
        const authenticated: UserContext =
          await this.jwtAuthenticationFilter.authenticate(token);
        // If authenticated is an instance of UserContext, set the user
        // in the request object
        if (authenticated && authenticated instanceof UserContext) {
          this.SetPrincipalContext(authenticated, request);

          return true;
        } else {
          return false; // Unauthorized access
        }
      }

      return false; // Unauthorized access
    }
  }

  /**
   *
   * @param authenticated UserContext
   * @description Set the principal context in the request object
   * @param request Request
   * @returns void
   */

  async SetPrincipalContext(authenticated: UserContext, request: Request) {
    request.user = new Principal(
      authenticated.email,
      authenticated.authorities,
    );
  }
}
