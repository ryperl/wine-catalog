import { Document } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IWineRegion {
  country: string;
  area: string;
  subregion?: string;
}

export interface IWineTastingNotes {
  appearance?: string;
  aroma: string[];
  taste: string[];
  finish?: string;
}

export interface IWineRatings {
  personal?: number;
  critic?: {
    score: number;
    reviewer: string;
  };
}

export interface IWineCellarLocation {
  room?: string;
  rack?: string;
  shelf?: string;
  position?: string;
  notes?: string;
}

export interface IWineCellar {
  quantity: number;
  location?: IWineCellarLocation;
  purchasePrice?: number;
  purchaseDate: Date;
  drinkBy?: Date;
}

export type WineStyle = 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert';

export interface IWine extends Document {
  userId: string;
  name: string;
  producer: string;
  vintage: number;
  region: IWineRegion;
  grapes: string[];
  style: WineStyle;
  alcohol: number;
  tastingNotes: IWineTastingNotes;
  ratings: IWineRatings;
  cellar: IWineCellar;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthRequest extends Request {
  user?: IUser;
}

export interface IJWTPayload {
  userId: string;
  email: string;
}
