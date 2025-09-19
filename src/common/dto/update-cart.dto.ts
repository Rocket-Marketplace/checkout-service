import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty({ description: 'Quantity', example: 3 })
  @IsNumber()
  @Min(1)
  quantity: number;
}
