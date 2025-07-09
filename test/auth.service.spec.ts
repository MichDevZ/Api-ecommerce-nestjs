import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';


describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwt = {
    sign: jest.fn().mockReturnValue('token123'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should register a user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({ id: 1, email: 'a@a.com' });

    const result = await service.register({
      email: 'a@a.com',
      password: '123456',
      name: 'Test',
    });

    expect(result.user.email).toBe('a@a.com');
    expect(mockPrisma.user.create).toBeCalled();
  });

  it('should throw if email exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ email: 'a@a.com' });

    await expect(
      service.register({ email: 'a@a.com', password: '123456', name: 'Test' }),
    ).rejects.toThrow('Email already exists');
  });

  it('should login and return token', async () => {
    const hash = await bcrypt.hash('123456', 10);
    mockPrisma.user.findUnique.mockResolvedValue({ id: 1, password: hash });

    const result = await service.login({
      email: 'a@a.com',
      password: '123456',
    });

    expect(result.access_token).toBe('token123');
  });

  it('should fail login with wrong password', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 1,
      password: await bcrypt.hash('other', 10),
    });

    await expect(
      service.login({ email: 'a@a.com', password: '123456' }),
    ).rejects.toThrow('Invalid credentials');
  });
});