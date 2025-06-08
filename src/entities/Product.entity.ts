import { Product } from '@prisma/client';

export class ProductEntity {
  name: string;
  description: string | null;
  price: number;
  in_stock: number | null;
  id?: number;
  constructor(
    name: string,
    description: string | null,
    price: number,
    in_stock: number | null,
    id?: number,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.in_stock = in_stock;
    this.price = parseFloat(price.toString());
    this.name = name;
  }

  public convertToEntity(product: any): ProductEntity {
    return new ProductEntity(
      product.title,
      product.description,
      parseFloat(product.price.toString()),
      product.in_stock,
      product.id,
    );
  }
}
