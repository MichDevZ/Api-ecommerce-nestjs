import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { calculateOrderTotal, createItemsPayload, returnAllOrderItems, returnAllOrdersWithTotal } from './helpers/orders-helpers';
import { OrderItem } from '@prisma/client';


@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateOrderDto) {
    try {
        const productIds = dto.items.map(i => i.productId);
    
    if (productIds.length === 0) {
      throw new NotFoundException('No products provided for the order');
    }

    const products = await this.findProductsInOrder(productIds)

    if (products.length !== productIds.length || products.length === 0) {
      throw new NotFoundException('One or more products not found');
    }

    const items = createItemsPayload(dto, products)

    const order = await this.prisma.order.create({
      data: {
        userId,
        items: {
            create: items
        },
        total: calculateOrderTotal(items as OrderItem[])
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
        throw new InternalServerErrorException('Order could not be created');
    }

    return {
        message: 'Order created successfully',
        orderId: order.id,
        createdAt: order.createdAt,
        total: order.total,
        items: returnAllOrderItems(order),
    };
    } catch (error) {
        throw new InternalServerErrorException('Error creating order: ' + error.message);
    }
    
  }

  async findAllForUser(userId: number) {
    try {
        const orders = await this.prisma.order.findMany({
            where: { userId },
            include: {
            items: {
                include: { product: true },
            },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (orders.length <= 0) {
            throw new NotFoundException('No orders found for this user');
        }

        return returnAllOrdersWithTotal(orders)
        
    } catch (error) {
        throw new InternalServerErrorException('Error fetching orders: ' + error.message);
    }
  }

  private async findProductsInOrder(productIds: number[]) { 
    return  this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });
  }
}