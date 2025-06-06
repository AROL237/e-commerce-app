import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CONSTANTS } from 'src/utils/CONSTANTS';

export class UserNotFoundException extends HttpException {
  constructor(message: string | CONSTANTS.NOTFOUND) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
