import { Controller, Get, Param, Res } from '@nestjs/common';
import { response, Response } from 'express';
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
  getProducts(@Res() res: Response): Response {
    return res.json({
      message: 'ok',
    });
  }
}
