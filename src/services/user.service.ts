/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, IUserDocument } from '../dto/interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUserDocument>,
  ) {}

  async findUserById(userId: string): Promise<IUserDocument | null> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUserByAuth0Id(auth0Id: string): Promise<IUserDocument | null> {
    const user = await this.userModel.findOne({ auth0Id }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(userData: IUser): Promise<IUserDocument> {
    const existingUser = await this.userModel.findOne({ auth0Id: userData.auth0Id }).exec();
    if (existingUser) {
      throw new ConflictException('User with this Auth0 ID already exists');
    }
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUserDocument | null> {
    const user = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
