import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { validate } from 'class-validator';

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
    signAsync: jest.fn().mockResolvedValue('token123')
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

    it('should validate LoginDto and fail on empty fields', async () => {
      const dto = new LoginDto();
      dto.email = '';
      dto.password = '';

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'email')).toBeTruthy();
      expect(errors.some(e => e.property === 'password')).toBeTruthy();
    });

});