import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@app/common';
import { CreateOrderRequest } from './dto/create-order.request';
import { UpdateOrderRequest } from './dto/update-order.request';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() request: CreateOrderRequest, @Req() req: any) {
    return this.ordersService.createOrder(request, req.cookies?.Authentication);
  }

  @Get()
  async getOrders() {
    return this.ordersService.getOrders();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateOrder(
    @Param('id') id: string,
    @Body() request: UpdateOrderRequest,
  ) {
    return this.ordersService.updateOrder(id, request);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
