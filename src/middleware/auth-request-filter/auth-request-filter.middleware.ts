import {
  Body,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NestMiddleware,
  Next,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { resourceUsage } from 'process';
import { Observable } from 'rxjs';
import { UserContext } from 'src/security/UserContext';
import { string } from 'zod';

@Injectable()
export class AuthRequestFilterMiddleware implements NestMiddleware {
  use(req: Request, @Res() res: Response, next: NextFunction) {
    var url = req.url;
    var METHOD = req.method;
    Logger.log(` User request : ${METHOD} ${url}`);

    if (
      METHOD == 'POST' &&
      (url == '/api/auth/login' || url == '/api/auth/register')
    ) {
      next();
    } else {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        // implement authentication.
        //extract authorization token
        req.access_token = authHeader.substring('Bearer '.length);
        next();
      } else throw new UnauthorizedException();
    }
  }
}
