/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IRestaurant } from '../database/model/restaurant.model';
import { IOrder, OrderStatus } from '../database/model/order.model';
import * as cloudinary from 'cloudinary';
import { Express } from 'express';
import { CreateCheckoutSessionDto } from 'src/dto/create-checkout-session.dto';
// import { OrderStatus } from '../database/model/order.model'; 
@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel('Restaurant') private readonly restaurantModel: Model<IRestaurant>,
    @InjectModel('Order') private readonly orderModel: Model<IOrder>,
  ) {}

  async getMyRestaurant(userId: string): Promise<IRestaurant> {
    try {
      return await this.restaurantModel.findOne({ user: userId }).exec();
    } catch (error) {
      throw new HttpException('Error finding restaurant', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createMyRestaurant(userId: string, restaurantData: any, file: Express.Multer.File): Promise<IRestaurant> {
    try {
      const existingRestaurant = await this.restaurantModel.findOne({ user: userId });

      if (existingRestaurant) {
        throw new HttpException('User restaurant already exists', HttpStatus.CONFLICT);
      }

      const imageUrl = await this.uploadImage(file);

      const restaurant = new this.restaurantModel(restaurantData);
      restaurant.imageUrl = imageUrl;
      restaurant.user = new Types.ObjectId(userId);
      restaurant.lastUpdated = new Date();
      await restaurant.save();

      return restaurant;
    } catch (error) {
      throw new HttpException(error.message || 'Failed to create restaurant', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateMyRestaurant(userId: string, restaurantData: any, file: Express.Multer.File): Promise<IRestaurant> {
    try {
      const restaurant = await this.restaurantModel.findOne({ user: userId });

      if (!restaurant) {
        throw new HttpException('Restaurant not found', HttpStatus.NOT_FOUND);
      }

      Object.assign(restaurant, restaurantData);
      restaurant.lastUpdated = new Date();

      if (file) {
        const imageUrl = await this.uploadImage(file);
        restaurant.imageUrl = imageUrl;
      }

      await restaurant.save();
      return restaurant;
    } catch (error) {
      throw new HttpException(error.message || 'Failed to update restaurant', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMyRestaurantOrders(userId: string): Promise<IOrder[]> {
    try {
      const restaurant = await this.restaurantModel.findOne({ user: userId });

      if (!restaurant) {
        throw new HttpException('Restaurant not found', HttpStatus.NOT_FOUND);
      }

      return await this.orderModel.find({ restaurant: restaurant._id })
        .populate('restaurant')
        .populate('user')
        .exec();
    } catch (error) {
      throw new HttpException(error.message || 'Failed to fetch restaurant orders', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateOrderStatus(userId: string, orderId: string, status: OrderStatus): Promise<IOrder> {
    try {
      const order = await this.orderModel.findById(orderId);

      if (!order) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }

      const restaurant = await this.restaurantModel.findById(order.restaurant);

      if (!restaurant || restaurant.user.toString() !== userId) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      order.status = status;
      await order.save();

      return order;
    } catch (error) {
      throw new HttpException(error.message || 'Failed to update order status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const base64Image = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${base64Image}`;

      const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
      return uploadResponse.url;
    } catch (error) {
      throw new HttpException('Failed to upload image', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async createCheckoutSession(userId: string, createCheckoutSessionDto: CreateCheckoutSessionDto): Promise<any> {
    // Implementation of createCheckoutSession logic
    // Example implementation:
    const { cartItems, deliveryDetails, restaurantId } = createCheckoutSessionDto;
    // Logic to create checkout session based on received data
    return { userId, cartItems, deliveryDetails, restaurantId }; // Replace with actual implementation
  }
}
