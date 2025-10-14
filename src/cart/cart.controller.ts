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
    @Request() req: { user: { id: string } },
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCart(@Request() req: { user: { id: string } }) {
    return this.cartService.getCart(req.user.id);
  }

  @Get('total')
  @ApiOperation({ summary: 'Get cart total' })
  @ApiResponse({
    status: 200,
    description: 'Cart total calculated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCartTotal(@Request() req: { user: { id: string } }) {
    return this.cartService.getCartTotal(req.user.id);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Process checkout and create payment order' })
  @ApiResponse({ status: 201, description: 'Checkout processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkout(
    @Request() req: { user: { id: string } },
    @Body() checkoutDto: CheckoutDto,
  ) {
    return this.cartService.processCheckout(req.user.id, checkoutDto);
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateCartItem(
    @Request() req: { user: { id: string } },
    @Param('productId') productId: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.updateCartItem(
      req.user.id,
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
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeFromCart(
    @Request() req: { user: { id: string } },
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(req.user.id, productId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 204, description: 'Cart cleared successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async clearCart(@Request() req: { user: { id: string } }) {
    return this.cartService.clearCart(req.user.id);
  }
}
