import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AppService } from '../service/app.service';
import { User } from 'generated/prisma';
import { Response } from 'express';

@Controller('api/auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  registerUser() {

    //todo: endpoint to create a user.
    return {
      username: '',
      access_token: '',
      refresh_token: '',
    };
  }
}
