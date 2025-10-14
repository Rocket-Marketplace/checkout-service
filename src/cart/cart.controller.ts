import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from '../common/dto/add-to-cart.dto';
import { UpdateCartDto } from '../common/dto/update-cart.dto';
import { CheckoutDto } from '../common/dto/checkout.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async addToCart(
    @Request() req: any,
    @Body() addToCartDto: AddToCartDto,
  ) {
    const userId = req.headers['x-user-id'];
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  async getCart(@Request() req: any) {
    const userId = req.headers['x-user-id'];
    return this.cartService.getCart(userId);
  }

  @Get('total')
  @ApiOperation({ summary: 'Get cart total' })
  @ApiResponse({
    status: 200,
    description: 'Cart total calculated successfully',
  })
  async getCartTotal(@Request() req: any) {
    const userId = req.headers['x-user-id'];
    return this.cartService.getCartTotal(userId);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Process checkout and create payment order' })
  @ApiResponse({ status: 201, description: 'Checkout processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async checkout(
    @Request() req: any,
    @Body() checkoutDto: CheckoutDto,
  ) {
    const userId = req.headers['x-user-id'];
    return this.cartService.processCheckout(userId, checkoutDto);
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateCartItem(
    @Request() req: any,
    @Param('productId') productId: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    const userId = req.headers['x-user-id'];
    return this.cartService.updateCartItem(
      userId,
      productId,
      updateCartDto,
    );
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 204,
    description: 'Item removed from cart successfully',
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async removeFromCart(
    @Request() req: any,
    @Param('productId') productId: string,
  ) {
    const userId = req.headers['x-user-id'];
    return this.cartService.removeFromCart(userId, productId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 204, description: 'Cart cleared successfully' })
  async clearCart(@Request() req: any) {
    const userId = req.headers['x-user-id'];
    return this.cartService.clearCart(userId);
  }
}
