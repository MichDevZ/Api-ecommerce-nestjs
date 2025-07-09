import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';


describe('ProductsService', () => {
  let service: ProductsService;

  const mockPrisma = {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should return all products', async () => {
    mockPrisma.product.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const result = await service.findAll();
    expect(result).toHaveLength(2);
  });

  it('should return a product by id', async () => {
    mockPrisma.product.findUnique.mockResolvedValue({ id: 1 });
    const result = await service.findOne(1);
    expect(result.id).toBe(1);
  });

  it('should throw if product not found', async () => { 
    mockPrisma.product.findUnique.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow('Product with id 999 not found');
  })
});