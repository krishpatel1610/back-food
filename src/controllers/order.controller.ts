/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Req, Res } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateCheckoutSessionDto } from '../dto/create-checkout-session.dto';
import { Request, Response } from 'express';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getMyOrders(@Req() req: Request, @Res() res: Response) {
    try {
      // Type assertion
      const userId = (req as any).userId;
      const orders = await this.orderService.getMyOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  @Post('checkout-session')
  async createCheckoutSession(@Req() req: Request, @Body() createCheckoutSessionDto: CreateCheckoutSessionDto, @Res() res: Response) {
    try {
      // Type assertion
      const userId = (req as any).userId;
      const paytmParams = await this.orderService.createCheckoutSession(userId, createCheckoutSessionDto);
      res.json(paytmParams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  @Post('paytm-callback')
  async paytmCallbackHandler(@Body() body: any, @Res() res: Response) {
    try {
      await this.orderService.paytmCallbackHandler(body);
      res.redirect(`${process.env.FRONTEND_URL}/order-status?success=true`);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
}
