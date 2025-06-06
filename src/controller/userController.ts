import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Logger,
  Res,
  HttpStatus,
  Inject,
  UseFilters,
  HttpCode,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../service/User.service';
import { User } from 'src/entities/User.entity';
import { UserDtoRequest } from 'src/dtos/user/UserDtoRequest';
import { Request, Response } from 'express';
import { ApiResponse } from 'src/dtos/response/ApiResonse';
import { CONSTANTS } from 'src/utils/CONSTANTS';
import { number } from 'zod';

@Controller('/api/auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async createCustomer(
    @Body() createUser: UserDtoRequest,
    @Req() req: Request,
    @Res() response: Response,
  ): Promise<Response> {
    Logger.log('register new customer :', createUser);
    const user: Promise<User> = this.userService.createUser(createUser);

    const out: ApiResponse = {
      status_code: HttpStatus.CREATED,
      data: await user,
      message: CONSTANTS.SUCCESSFUL,
    };
    return response.status(HttpStatus.CREATED).json(out);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    const out: ApiResponse = {
      status_code: HttpStatus.OK,
      data: {
        access_token: request.access_token,
        refresh_token: request.refresh_token,
      },
      message: CONSTANTS.SUCCESSFUL,
    };
    return response.json(out);
  }

  @Get('/me')
  async findOne(@Query('id') id: number, @Res() response) {
    Logger.log('find user by id:', id);
    try {
      if (!id) {
        throw new Error('User ID is required in properties', {
          cause: 'BadRequest',
        });
      }
      if (isNaN(id)) {
        throw new Error('User ID must be a number', {
          cause: 'BadRequest',
        });
      }
      id = parseInt(id.toString());
      const user = await this.userService.findOne(id);

      if (user === null) {
        const out: ApiResponse = {
          message: 'NotFount',
          status_code: HttpStatus.NOT_FOUND,
        };
        return response.status(HttpStatus.NOT_FOUND).json(out);
      } else {
        const out: ApiResponse = {
          message: 'successful',
          status_code: HttpStatus.OK,
          data: user,
        };
        return response.status(HttpStatus.OK).json(out);
      }

      // else throw new Error('User not found', { cause: 'NotFound' });
    } catch (error) {
      if (error.cause === 'BadRequest') {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    //  to be implemented.
    return this.userService.remove(+id);
  }
}
