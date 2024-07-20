/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Req, Res, UseGuards, UploadedFile} from '@nestjs/common';
import { RestaurantService } from '../services/restaurant.service';
import { CreateCheckoutSessionDto } from '../dto/create-checkout-session.dto'; // Define this DTO if not already done
import { CreateRestaurantDto } from '../dto/create-checkout-session.dto'; // Define this DTO
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrderStatus } from 'src/database/model/order.model';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('my-restaurant')
  async getMyRestaurant(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = this.getUserIdFromRequest(req); // Extract userId
      const restaurant = await this.restaurantService.getMyRestaurant(userId);
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  @Post('checkout-session')
  async createCheckoutSession(@Req() req: Request, @Body() createCheckoutSessionDto: CreateCheckoutSessionDto, @Res() res: Response) {
    try {
      const userId = this.getUserIdFromRequest(req); // Extract userId
      const paytmParams = await this.restaurantService.createCheckoutSession(userId, createCheckoutSessionDto);
      res.json(paytmParams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  @Post('update-restaurant')
  @UseGuards(FileInterceptor('file'))
  async updateMyRestaurant(@Req() req: Request, @UploadedFile() file: Express.Multer.File, @Body() updateRestaurantDto: CreateRestaurantDto, @Res() res: Response) {
    try {
      const userId = this.getUserIdFromRequest(req); // Extract userId
      const restaurant = await this.restaurantService.updateMyRestaurant(userId, updateRestaurantDto, file);
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  @Get('orders')
  async getMyRestaurantOrders(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = this.getUserIdFromRequest(req); // Extract userId
      const orders = await this.restaurantService.getMyRestaurantOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  @Post('update-order-status')
  async updateOrderStatus(
    @Req() req: Request,
    @Body('orderId') orderId: string,
    @Body('status') status: OrderStatus, // Ensure status is typed as OrderStatus
    @Res() res: Response
  ) {
    try {
      const userId = this.getUserIdFromRequest(req); // Extract userId
      const updatedOrder = await this.restaurantService.updateOrderStatus(userId, orderId, status);
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
private getUserIdFromRequest(req: Request): string {
    // Implement your logic to extract userId from request headers, session, or wherever it's stored
    return req.headers['authorization']; // Example assuming userId is stored in Authorization header
  }
}

