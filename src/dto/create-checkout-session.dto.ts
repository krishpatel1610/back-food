/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryDetailsDto } from './delivery-details.dto';

export class CartItemDto {
    @IsString()
    @IsNotEmpty()
    menuItemId: string;
  
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    quantity: string;
  }

export class CreateCheckoutSessionDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    cartItems: CartItemDto[];
  
    @ValidateNested()
    @Type(() => DeliveryDetailsDto)
    deliveryDetails: DeliveryDetailsDto;
  
    @IsString()
    @IsNotEmpty()
    restaurantId: string;
  }
  export class CreateRestaurantDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsString()
    @IsNotEmpty()
    addressLine1: string;
  
    @IsString()
    @IsNotEmpty()
    city: string;
  }
