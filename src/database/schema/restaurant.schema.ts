/* eslint-disable prettier/prettier */
// src/database/schema/restaurant.schema.ts
import { Schema, Document, model } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  user: Schema.Types.ObjectId;
  imageUrl: string;
  lastUpdated: Date;
  menuItems: {
    _id: string;
    name: string;
    price: number;
  }[];
  deliveryPrice: number;
}

export const RestaurantSchema: Schema = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
  menuItems: [
    {
      _id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  deliveryPrice: { type: Number, required: true },
});

export const RestaurantModel = model<IRestaurant>('Restaurant', RestaurantSchema);
