/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user.module';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import * as dotenv from 'dotenv';
import { OrderModule } from './order.module';
import { RestaurantModule } from './restaurant.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING),
    OrderModule,
    UserModule,

    RestaurantModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
