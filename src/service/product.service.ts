import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ProductInterface } from 'src/interface/Product.interface';
import { Product } from '@prisma/client';
import { ProductEntity } from 'src/entities/Product.entity';
import { ProductDto } from 'src/dtos/Product.dto';
import { PageRequest } from 'src/controller/product.controller';
import { objectUtil } from 'zod';
import { NotFoundError, throwError, toArray } from 'rxjs';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductService implements ProductInterface {
  constructor(private prisma: PrismaService) {}
  async addProduct(product: ProductDto): Promise<ProductEntity> {
    try {
      //create a new product
      const saved = await this.prisma.product.create({
        data: {
          title: product.name.trim().toLowerCase(),
          price: product.price,
          description: product.description,
          in_stock: product.in_stock,
        },
      });
      //return ProductEntity
      return ProductEntity.prototype.convertToEntity(saved);
    } catch (error) {
      throw new Error(error);
    }
  }
  async findAllProducts(filter: PageRequest): Promise<Array<ProductEntity>> {
    try {
      const page = filter.page ?? 1;
      const limit = filter.limit ?? 10;
      const skip = (page - 1) * limit;
      const productList = await this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: filter.orderBy,
      });

      return productList.map((product) =>
        ProductEntity.prototype.convertToEntity(product),
      );
    } catch (error) {
      throw error;
    }
  }

  //get a product by Id
  async findById(productId: number): Promise<ProductEntity | null> {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      // if (product === null) return null;
      return ProductEntity.prototype.convertToEntity(product);
    } catch (error) {
      throw error;
    }
  }
  //update product details
  async updateProduct(
    productEntity: ProductEntity,
    id: number,
  ): Promise<ProductEntity> {
    try {
      const updateProduct = await this.prisma.product.update({
        where: { id },
        data: {
          title: productEntity.name,
          description: productEntity.description,
          price: productEntity.price,
          in_stock: productEntity.in_stock,
        },
      });

      return ProductEntity.prototype.convertToEntity(updateProduct);
    } catch (error) {
      throw error;
    }
  }

  //delet a product by id
  async deleteProduct(productId: number): Promise<void> {
    try {
      // todo: delete and include relation
      const product = await this.prisma.product.delete({
        where: { id: productId },
      });
    } catch (error) {
      throw error;
    }
  }
}
