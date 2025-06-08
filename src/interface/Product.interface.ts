import { PageRequest } from 'src/controller/product.controller';
import { ProductDto } from 'src/dtos/Product.dto';
import { ProductEntity } from 'src/entities/Product.entity';

export interface ProductInterface {
  addProduct(product: ProductDto): Promise<ProductEntity>;
  findById(productId: number): Promise<ProductEntity | null>;
  updateProduct(
    productDto: ProductEntity,
    productId: number,
  ): Promise<ProductEntity>;
  deleteProduct(productId: number): Promise<void>;
  findAllProducts(filter: PageRequest): Promise<Array<ProductEntity>>;
}
