import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './entities/cart.entity';
import { ProductsService } from '../services/products.service';
import { CircuitBreakerModule } from '../common/circuit-breaker/circuit-breaker.module';
import { EventsModule } from '../events/events.module';
// import { SessionValidationService } from '../auth/session-validation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), HttpModule, CircuitBreakerModule, EventsModule],
  controllers: [CartController],
  providers: [CartService, ProductsService],
  exports: [CartService],
})
export class CartModule {}
