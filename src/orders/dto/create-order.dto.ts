import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, Min, ValidateNested } from 'class-validator';

class OrderItemDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({ example: 2, description: 'Product quantity' })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
   @ApiProperty({
    type: [OrderItemDto],
    description: 'Items in order',
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1) 
  @ValidateNested({ each: true }) 
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}