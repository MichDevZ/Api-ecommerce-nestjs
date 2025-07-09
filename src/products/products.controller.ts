import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiGetAllResponses, ApiGetOneByIdByIdResponses } from './api-responses/products-responses';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiGetAllResponses
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiGetOneByIdByIdResponses
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }
}