/* eslint-disable prettier/prettier */
// restaurant.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantController } from './controllers/restaurant.controller';
import { RestaurantService } from './services/restaurant.service';
import { OrderModel } from './database/model/order.model'; // Adjust the path based on your project structure
// import { IRestaurant } from './/database/model/restaurant.model'; // Adjust the path based on your project structure
import { RestaurantSchema } from './database/schema/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderModel.schema },
      { name: 'Restaurant', schema: RestaurantSchema},
    ]),
    // Import other modules as needed
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
