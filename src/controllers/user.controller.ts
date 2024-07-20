/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Body, Param, NotFoundException, ConflictException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { IUser } from '../dto/interfaces/user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.userService.findUserById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @Post()
  async createUser(@Body() userData: IUser) {
    try {
      const user = await this.userService.createUser(userData);
      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('User with this Auth0 ID already exists');
      }
      throw new Error('Error creating user');
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateData: Partial<IUser>) {
    try {
      const user = await this.userService.updateUser(id, updateData);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
