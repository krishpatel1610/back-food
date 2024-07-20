/* eslint-disable prettier/prettier */
// src/database/model/restaurant.model.ts
import { Document, Types } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  user: Types.ObjectId; // Change this to Types.ObjectId
  imageUrl: string;
  lastUpdated: Date;
  menuItems: {
    _id: string;
    name: string;
    price: number;
  }[];
  deliveryPrice: number;
}
