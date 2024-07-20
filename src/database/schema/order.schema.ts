/* eslint-disable prettier/prettier */
// src/database/schema/order.schema.ts
import { Schema, Document, model } from 'mongoose';

export enum OrderStatus {
  PLACED = 'placed',
  PAID = 'paid',
  IN_PROGRESS = 'inProgress',
  OUT_FOR_DELIVERY = 'outForDelivery',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export interface IOrder extends Document {
  restaurant: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
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
  status: OrderStatus;
  createdAt: Date;
}

export const OrderSchema: Schema = new Schema({
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  deliveryDetails: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
  },
  cartItems: [
    {
      menuItemId: { type: String, required: true },
      quantity: { type: Number, required: true },
      name: { type: String, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const OrderModel = model<IOrder>('Order', OrderSchema);
