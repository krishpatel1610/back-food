/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';

export interface IUser {
  auth0Id: string;
  email: string;
  name?: string;
  addressLine1?: string;
  city?: string;
  country?: string;
}

export interface IUserDocument extends IUser, Document {}
