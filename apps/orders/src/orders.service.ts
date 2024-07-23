import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE } from './constants/services';
import { CreateOrderRequest } from './dto/create-order.request';
import { UpdateOrderRequest } from './dto/update-order.request';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  async createOrder(request: CreateOrderRequest, authentication: string) {
    const session = await this.ordersRepository.startTransaction();
    try {
      const order = await this.ordersRepository.create(request, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
          Authentication: authentication,
        }),
      );
      await session.commitTransaction();
      return order;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  async getOrders() {
    return this.ordersRepository.find({});
  }

  async updateOrder(orderId: string, request: UpdateOrderRequest) {
    const updatedOrder = await this.ordersRepository.findOneAndUpdate(
      { _id: orderId },
      { $set: request },
    );
    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }
    return updatedOrder;
  }

  async deleteOrder(orderId: string) {
    const deletedOrder = await this.ordersRepository.findOneAndDelete({
      _id: orderId,
    });
    if (!deletedOrder) {
      throw new NotFoundException('Order not found');
    }
    return deletedOrder;
  }
}
