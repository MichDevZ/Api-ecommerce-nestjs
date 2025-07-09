import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export const ApiCreateResponses = applyDecorators(
  ApiOperation({ summary: 'Create Order' }),
  ApiResponse({ status: 404, description: 'No products provided for the order' }),
  ApiResponse({ status: 404, description: 'One or more products not found' }),
  ApiResponse({ status: 500, description: 'Order could not be created' }),
  ApiResponse({ status: 500, description: 'Error creating order' }),
  ApiResponse({ status: 200, description: 'Order Created' }),
  ApiResponse({ status: 400, description: 'Invalid Token' }),
);

export const ApiGetOrderByIdResponses = applyDecorators(
  ApiOperation({ summary: 'Get user orders' }),
  ApiResponse({ status: 404, description: 'No products provided for the order' }),
  ApiResponse({ status: 404, description: 'No orders found for this user' }),
  ApiResponse({ status: 500, description: 'Error creating order' }),
  ApiResponse({ status: 401, description: 'Invalid Token' }),
  ApiResponse({ status: 400, description: 'Bad Request' }),
);