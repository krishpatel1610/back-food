/* eslint-disable prettier/prettier */
import { Document, Types } from 'mongoose';

export interface IMenuItem {
  _id: Types.ObjectId;
  name: string;
  price: number;
}

export interface IRestaurant {
  user: Types.ObjectId;
  restaurantName: string;
  city: string;
  country: string;
  deliveryPrice: number;
  estimatedDeliveryTime: number;
  cuisines: string[];
  menuItems: IMenuItem[];
  imageUrl: string;
  lastUpdated: Date;
}

export interface IRestaurantDocument extends IRestaurant, Document {}
