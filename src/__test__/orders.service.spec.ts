import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { OrdersService } from 'src/orders/orders.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('OrdersService', () => {
  let service: OrdersService;

  const mockPrisma = {
    product: {
      findMany: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should throw if a product is invalid', async () => {
    mockPrisma.product.findMany.mockResolvedValue([{ id: 1 }]);
    const dto = { items: [{ productId: 1, quantity: 1 }, { productId: 999, quantity: 1 }] };

    await expect(service.create(1, dto)).rejects.toThrow('Error creating order: One or more products not found');
  });

  it('should create an order', async () => {
    const dto = { items: [{ productId: 1, quantity: 2 }] };
    mockPrisma.product.findMany.mockResolvedValue([{ id: 1, price: 1000 }]);
    mockPrisma.order.create.mockResolvedValue({
      id: 1,
      createdAt: new Date(),
      total: 2000,
      items: [
        {
          quantity: 2,
          product: { name: 'Test', price: 1000 },
        },
      ],
    });

    const result = await service.create(1, dto);
    expect(result.total).toBe(2000);
    expect(result.items).toHaveLength(1);
  });

    it('should validate create order DTO and fail on empty fields', async () => {
    const dto = new CreateOrderDto();
    dto.items = [];

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'items')).toBeTruthy();
    });
});