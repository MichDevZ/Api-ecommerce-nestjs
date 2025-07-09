import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export const ApiLoginResponses = applyDecorators(
  ApiOperation({ summary: 'User login' }),
  ApiResponse({ status: 201, description: 'User logged in successfully' }),
  ApiResponse({ status: 401, description: 'Invalid credentials' }),
  ApiResponse({ status: 404, description: 'User not found' }),
  ApiResponse({ status: 400, description: 'Invalid input (DTO validation failed)' }),
  ApiResponse({ status: 500, description: 'Internal server error' }),
);

export const ApiRegisterResponses = applyDecorators(
  ApiOperation({ summary: 'Register a new user' }),
  ApiResponse({ status: 409, description: 'Email already exists' }),
  ApiResponse({ status: 201, description: 'User created successfully' }),
  ApiResponse({ status: 400, description: 'Invalid input (DTO validation failed)' }),
  ApiResponse({ status: 500, description: 'Internal server error' }),
);

export const ApiMeResponses = applyDecorators(
  ApiOperation({ summary: 'Get user Data' }),
  ApiResponse({ status: 401, description: 'Invalid Token' }),
  ApiResponse({ status: 200, description: 'Valid request' }),
);
