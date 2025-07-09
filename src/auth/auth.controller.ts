import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiLoginResponses, ApiMeResponses, ApiRegisterResponses } from './api-responses/auth-responses';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiRegisterResponses
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @ApiLoginResponses
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiMeResponses
  getProfile(@User() user: any) {
    return {
      user,
    };
  }
}