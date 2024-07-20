/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';

export interface Order extends Document {
  restaurant: string;
  user: string;
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  cartItems: {
    menuItemId: string;
    quantity: number;
    name: string;
  }[];
  totalAmount: number;
  status: 'placed' | 'paid' | 'inProgress' | 'outForDelivery' | 'delivered' | 'failed';
  createdAt: Date;
}
