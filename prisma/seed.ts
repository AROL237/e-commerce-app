// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import { encode } from '../src/utils/PasswordEncoder.util';

const prisma = new PrismaClient();
async function main() {
  const user1 = await prisma.user.create({
    data: {
      first_name: 'Alice',
      last_name: 'Smith',
      email: 'alice@example.com',
      password: await encode('1234'),
      role: Role.USER,
      is_active: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      first_name: 'Bob',
      last_name: 'Johnson',
      email: 'bob@example.com',
      password: await encode('1234'),
      role: Role.ADMIN,
      is_active: true,
      access_code: 'admin123',
    },
  });

  // Create Products
  const product1 = await prisma.product.create({
    data: {
      title: 'laptop',
      description: 'A powerful laptop',
      price: 1200.0,
      in_stock: 10,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      title: 'phone',
      description: 'A smart phone',
      price: 800.0,
      in_stock: 20,
    },
  });

  // Create Orders
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      total: 2000,
      status: false,
      orderItems: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
          },
          {
            productId: product2.id,
            quantity: 1,
          },
        ],
      },
    },
  });

  console.log({
    user1,
    // user2,
    product1,
    product2,
    order1,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
