import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiCreateResponses, ApiGetOrderByIdResponses } from './api-responses/orders-responses';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiCreateResponses
  create(@User('userId') userId: number, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(userId, dto);
  }

  @Get()
  @ApiGetOrderByIdResponses
  findAll(@User('userId') userId: number) {
    return this.ordersService.findAllForUser(userId);
  }
}