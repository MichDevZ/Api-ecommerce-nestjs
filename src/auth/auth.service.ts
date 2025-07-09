import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,  private jwt: JwtService) {}

  async register(data: RegisterDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const emailExists = await this.validateEmail(data.email) 

    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    try {
      const user = await this.prisma.user.create({
          data: {
            email: data.email.toLowerCase(),
            password: hashedPassword,
            name: data.name,
          },
        });

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }

 
  }

    async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordValid = await bcrypt.compare(data.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      const payload = {
        sub: user.id,
        email: user.email,
        name: user.name
    };

    const token = await this.jwt.signAsync(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }

  }

  private async validateEmail (email: string) { 
    return await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })
  }
  
}