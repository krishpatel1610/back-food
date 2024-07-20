/* eslint-disable prettier/prettier */
import mongoose from 'mongoose';
import { UserSchema } from '../schema/user.schema';
import { IUserDocument } from 'src/dto/interfaces/user.interface';

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
