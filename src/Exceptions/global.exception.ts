import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { UserNotFoundException } from './UserNotFound.exception';

@Catch(ConflictException, UserNotFoundException)
export class globalExceptionHandler implements ExceptionFilter {
  catch(exception: ConflictException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(HttpStatus.CONFLICT).json({
      statusCode: status,
      message: exception.message,
      error: 'CONFLICT',
    });
  }
 
}

