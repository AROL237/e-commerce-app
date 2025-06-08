import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Response } from 'express';
import { ProductDto } from 'src/dtos/Product.dto';
import { ApiResponse } from 'src/dtos/response/ApiResonse';
import { ProductEntity } from 'src/entities/Product.entity';
import { ProductService } from 'src/service/product.service';
@Controller('api/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  /**
   *list all products return
   * @param
   * @returns @type ProductResponse
   */

  @Get()
  async getProducts(
    @Body() productDto: ProductDto,
    @Res() res: Response,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('orderBy') orderBy: string,
    // @Query('filter') filter?: PageRequest,
  ): Promise<Response> {
    try {
      const pageRequest: PageRequest = {
        page: parseInt(page.toString()) ?? 1,
        limit: parseInt(limit.toString()) ?? 10,
        orderBy: JSON.parse(orderBy) ?? undefined,
      };
      const product: Array<ProductEntity> =
        await this.productService.findAllProducts(pageRequest);

      const out: ApiResponse = {
        data: product,
        message: 'successful',
        status_code: HttpStatus.OK,
      };
      return res.json(out);
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: 'input validation error, Please verify input props',
          stats_code: HttpStatus.BAD_REQUEST,
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  // find a product bu its id
  @Get('/:id')
  async findOne(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      if (id == undefined || isNaN(id))
        throw new Error('Bad request ', { cause: 'BadRequest' });
      const product: ProductEntity | null = await this.productService.findById(
        parseInt(id.toString()),
      );

      const out: ApiResponse = {
        message: 'successful',
        data: product,
        status_code: HttpStatus.OK,
      };
      return res.status(HttpStatus.OK).json(out);
    } catch (error) {
      if (error.cause == 'BadRequest')
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
          status_code: HttpStatus.BAD_REQUEST,
        });
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'not found id:' + id,
        status_code: HttpStatus.NOT_FOUND,
      });
    }
  }

  //create a product
  @Post()
  async createNewproduct(
    @Body() productDto: ProductDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const product: ProductEntity =
        await this.productService.addProduct(productDto);
      const out: ApiResponse = {
        message: 'successful',
        data: product,
        status_code: HttpStatus.CREATED,
      };
      return res.status(HttpStatus.CREATED).json(out);
    } catch (error) {
      if (error instanceof PrismaClientValidationError)
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'invalid properties',
          status_code: HttpStatus.BAD_REQUEST,
        });
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
    return res.json();
  }

  //update a product imformation
  @Put('/:id')
  async updateProductDetails(
    @Param('id') id: number,
    @Body() productDto: ProductEntity,
    @Res() res: Response,
  ) {
    try {
      id = parseInt(id.toString());

      const product = await this.productService.updateProduct(productDto, id);

      return res.status(HttpStatus.OK).json({
        message: 'successful',
        data: product,
        satus_code: HttpStatus.OK,
      });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'invalide input properties , please verify your request',
          status_code: HttpStatus.BAD_REQUEST,
        });
      }
      return res.status(HttpStatus.NOT_FOUND).json({
        message: error.meta.cause,
        status_code: HttpStatus.NOT_FOUND,
      });
    }
  }
  //delete a product id
  @Delete('/:id')
  async deleteProductById(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      id = parseInt(id.toString());
      if (isNaN(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          messsage: 'Bad Request ',
          status_code: HttpStatus.BAD_REQUEST,
        });
      }
      await this.productService.deleteProduct(id);

      return res.status(HttpStatus.NO_CONTENT).json({
        message: `record with id: ${id} removed`,
        status_codde: HttpStatus.NO_CONTENT,
      });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'invalide input properties , please verify your request',
          status_code: HttpStatus.BAD_REQUEST,
        });
      }
      return res.status(HttpStatus.NOT_FOUND).json({
        messsage: `product not found id: ${id}`,
        status_code: HttpStatus.NOT_FOUND,
      });
    }
  }
}

export type PageRequest = {
  page?: number;
  limit?: number;
  orderBy?: any;
};
