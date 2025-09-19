import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './entities/cart.entity';
import { ProductsService } from '../services/products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), HttpModule],
  controllers: [CartController],
  providers: [CartService, ProductsService],
  exports: [CartService],
})
export class CartModule {}
