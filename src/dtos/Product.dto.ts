import { z } from 'zod';

export class ProductDto {
  name: string;
  description: string;
  price: number;
  in_stock: number;
}

