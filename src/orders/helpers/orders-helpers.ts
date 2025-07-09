import { Order, OrderItem, Product } from "@prisma/client";
import { CreateOrderDto } from "../dto/create-order.dto";
import { OrderWithItemsAndProduct } from "src/products/interfaces/products";


function calculateOrderItemsTotal(productPrice: number, quantity: number): number {
  return productPrice * quantity;
}

export function createItemsPayload (dto: CreateOrderDto, products: Product[]) {
    return dto.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        subtotal: calculateOrderItemsTotal(products.find(p => p.id === i.productId)!.price, i.quantity),
        }))
}

export function calculateOrderTotal(items: OrderItem[]) {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
}


export function returnAllOrdersWithTotal(orders: OrderWithItemsAndProduct[]) {
    return orders.map(order => {
      const total = order.items.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0,
      );

      return {
        orderId: order.id,
        createdAt: order.createdAt,
        total,
        items: order.items.map(i => ({
          product: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          subtotal: i.product.price * i.quantity,
        })),
      };
    });
}

export function returnAllOrderItems (order: OrderWithItemsAndProduct) {
    return order.items.map(i => ({
            product: i.product.name,
            quantity: i.quantity,
            price: i.product.price,
            subtotal: i.subtotal,
        }))
} 

