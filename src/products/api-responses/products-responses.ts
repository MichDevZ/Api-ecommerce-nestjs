import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export const ApiGetAllResponses = applyDecorators(
  ApiOperation({ summary: 'Get all products' }),
  ApiResponse({ status: 500, description: 'Internal Server Error' }),
  ApiResponse({ status: 200, description: 'Ok' }),
);

export const ApiGetOneByIdByIdResponses = applyDecorators(
  ApiOperation({ summary: 'Find one product' }),
  ApiResponse({ status: 404, description: 'Product not found' }),
  ApiResponse({ status: 500, description: 'Internal server error' }),
  ApiResponse({ status: 200, description: 'Ok' }),
);