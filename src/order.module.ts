/* eslint-disable prettier/prettier */
// src/order.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './database/schema/order.schema';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { RestaurantSchema } from './database/schema/restaurant.schema'; // Adjust the path as needed

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'Restaurant', schema: RestaurantSchema } // Add this line
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
