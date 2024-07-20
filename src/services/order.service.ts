/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import PaytmChecksum from 'paytmchecksum';
import { Order } from '../dto/interfaces/order.interface';
import { IRestaurant } from '../dto/interfaces/restaurant.interface';
import { CreateCheckoutSessionDto, CartItemDto } from '../dto/create-checkout-session.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Restaurant') private readonly restaurantModel: Model<IRestaurant>,
  ) {}

  async getMyOrders(userId: string): Promise<Order[]> {
    return this.orderModel.find({ user: userId }).populate('restaurant').populate('user').exec();
  }

  async createCheckoutSession(userId: string, createCheckoutSessionDto: CreateCheckoutSessionDto): Promise<any> {
    const restaurant = await this.restaurantModel.findById(createCheckoutSessionDto.restaurantId).exec();

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    const newOrder = new this.orderModel({
      restaurant: restaurant._id,
      user: userId,
      status: 'placed',
      deliveryDetails: createCheckoutSessionDto.deliveryDetails,
      cartItems: createCheckoutSessionDto.cartItems,
      createdAt: new Date(),
    });

    const totalAmount = this.calculateTotalAmount(createCheckoutSessionDto.cartItems, restaurant.menuItems, restaurant.deliveryPrice);
    const orderId = newOrder._id.toString();

    const paytmParams: any = {
      MID: process.env.PAYTM_MID,
      WEBSITE: process.env.PAYTM_WEBSITE,
      INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE_ID,
      CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
      ORDER_ID: orderId,
      CUST_ID: userId,
      TXN_AMOUNT: totalAmount.toString(),
      CALLBACK_URL: process.env.PAYTM_CALLBACK_URL,
      EMAIL: createCheckoutSessionDto.deliveryDetails.email,
      MOBILE_NO: '7777777777',
    };

    const checksum = await PaytmChecksum.generateSignature(paytmParams, process.env.PAYTM_MERCHANT_KEY);
    paytmParams.CHECKSUMHASH = checksum;

    await newOrder.save();
    return { paytmParams };
  }

  private calculateTotalAmount(cartItems: CartItemDto[], menuItems: any[], deliveryPrice: number): number {
    let totalAmount = 0;
    cartItems.forEach((cartItem) => {
      const menuItem = menuItems.find(item => item._id.toString() === cartItem.menuItemId.toString());
      if (menuItem) {
        totalAmount += menuItem.price * parseInt(cartItem.quantity);
      }
    });
    totalAmount += deliveryPrice;
    return totalAmount;
  }

  async paytmCallbackHandler(body: any): Promise<void> {
    const paytmChecksum = body.CHECKSUMHASH;
    const isVerifySignature = PaytmChecksum.verifySignature(body, process.env.PAYTM_MERCHANT_KEY, paytmChecksum);

    if (isVerifySignature) {
      const orderId = body.ORDERID;
      const order = await this.orderModel.findById(orderId).exec();

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (body.STATUS === 'TXN_SUCCESS') {
        order.status = 'paid';
        order.totalAmount = parseFloat(body.TXNAMOUNT);
      } else {
        order.status = 'failed';
      }

      await order.save();
    } else {
      throw new Error('Checksum mismatch');
    }
  }
}
