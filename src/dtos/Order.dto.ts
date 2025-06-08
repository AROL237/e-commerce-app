import { ProductEntity } from 'src/entities/Product.entity';
import { ProductDto } from './Product.dto';

export class OrderDto {
  id?: number;
  total?: number;
  status?: boolean;
  orderedItems: Array<{ productId: number; quantity: number }>;
}
