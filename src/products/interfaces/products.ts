import { Prisma } from '@prisma/client';

const orderWithItemsAndProduct = Prisma.validator<Prisma.OrderDefaultArgs>()({
  include: {
    items: {
      include: { product: true },
    },
  },
});

export type OrderWithItemsAndProduct = Prisma.OrderGetPayload<typeof orderWithItemsAndProduct>;

