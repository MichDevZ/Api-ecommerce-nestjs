import { Order, PrismaClient, Product, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed para usuarios
  const users: User[] = [];
  for (let i = 1; i <= 5; i++) {
    const hashedPassword = await bcrypt.hash(`password${i}`, 10);

    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: hashedPassword,
      },
    });

    users.push(user);
  }

  // Seed para productos
 const products: Product[] = [];
  for (let i = 1; i <= 5; i++) {
    const product = await prisma.product.create({
      data: {
        name: `Product ${i}`,
        description: `Description for product ${i}`,
        price: 10 * i,
      },
    });

    products.push(product);
  }

  // Seed para órdenes
 const orders: Order[] = [];
  for (let i = 0; i < 5; i++) {
    const order = await prisma.order.create({
      data: {
        userId: users[i].id,
        total: 0, 
      },
    });

    orders.push(order);
  }

  // Seed para OrderItems
  for (let i = 0; i < 5; i++) {
    let totalOrder = 0;

    for (let j = 0; j < 2; j++) {
      const product = products[(i + j) % products.length];
      const quantity = j + 1;
      const subtotal = product.price * quantity;

      await prisma.orderItem.create({
        data: {
          orderId: orders[i].id,
          productId: product.id,
          quantity,
          subtotal,
        },
      });

      totalOrder += subtotal;
    }

    await prisma.order.update({
      where: { id: orders[i].id },
      data: { total: totalOrder },
    });
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });