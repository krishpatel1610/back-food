/* eslint-disable prettier/prettier */
import mongoose, { Document, Model } from 'mongoose';
import { OrderSchema } from '../schema/order.schema';

// Define the OrderStatus type
export enum OrderStatus {
    Pending = 'pending',
    Processing = 'processing',
    Completed = 'completed',
    Cancelled = 'cancelled',
  }
  
export interface DeliveryDetails {
  email: string;
  name: string;
  addressLine1: string;
  city: string;
}

export interface CartItem {
  menuItemId: string;
  quantity: number;
  name: string;
}

export interface IOrder extends Document {
  restaurant: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  deliveryDetails: DeliveryDetails;
  cartItems: CartItem[];
  totalAmount: number;
  status: OrderStatus;  // Use the OrderStatus type here
  createdAt: Date;
}

export const OrderModel: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);
