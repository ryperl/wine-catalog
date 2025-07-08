import { Schema, model } from 'mongoose';
import { IWine } from '../types';

const wineRegionSchema = new Schema({
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
  },
  area: {
    type: String,
    required: [true, 'Area is required'],
    trim: true,
  },
  subregion: {
    type: String,
    trim: true,
  },
}, { _id: false });

const wineTastingNotesSchema = new Schema({
  appearance: {
    type: String,
    trim: true,
  },
  aroma: [{
    type: String,
    trim: true,
  }],
  taste: [{
    type: String,
    trim: true,
    required: true,
  }],
  finish: {
    type: String,
    trim: true,
  },
}, { _id: false });

const wineRatingsSchema = new Schema({
  personal: {
    type: Number,
    min: [1, 'Personal rating must be between 1 and 100'],
    max: [100, 'Personal rating must be between 1 and 100'],
  },
  critic: {
    score: {
      type: Number,
      min: [1, 'Critic score must be between 1 and 100'],
      max: [100, 'Critic score must be between 1 and 100'],
    },
    reviewer: {
      type: String,
      trim: true,
    },
  },
}, { _id: false });

const wineCellarLocationSchema = new Schema({
  room: {
    type: String,
    trim: true,
    maxlength: [50, 'Room name cannot exceed 50 characters'],
  },
  rack: {
    type: String,
    trim: true,
    maxlength: [20, 'Rack identifier cannot exceed 20 characters'],
  },
  shelf: {
    type: String,
    trim: true,
    maxlength: [20, 'Shelf identifier cannot exceed 20 characters'],
  },
  position: {
    type: String,
    trim: true,
    maxlength: [20, 'Position identifier cannot exceed 20 characters'],
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [200, 'Location notes cannot exceed 200 characters'],
  },
}, { _id: false });

const wineCellarSchema = new Schema({
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 1,
  },
  location: {
    type: wineCellarLocationSchema,
    default: {},
  },
  purchasePrice: {
    type: Number,
    min: [0, 'Purchase price cannot be negative'],
  },
  purchaseDate: {
    type: Date,
    required: [true, 'Purchase date is required'],
    default: Date.now,
  },
  drinkBy: {
    type: Date,
  },
}, { _id: false });

const wineSchema = new Schema<IWine>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Wine name is required'],
      trim: true,
      maxlength: [200, 'Wine name cannot exceed 200 characters'],
    },
    producer: {
      type: String,
      required: [true, 'Producer is required'],
      trim: true,
      maxlength: [200, 'Producer name cannot exceed 200 characters'],
    },
    vintage: {
      type: Number,
      required: [true, 'Vintage is required'],
      min: [1800, 'Vintage must be after 1800'],
      max: [new Date().getFullYear(), 'Vintage cannot be in the future'],
    },
    region: {
      type: wineRegionSchema,
      required: [true, 'Region is required'],
    },
    grapes: [{
      type: String,
      trim: true,
      required: true,
    }],
    style: {
      type: String,
      required: [true, 'Wine style is required'],
      enum: {
        values: ['red', 'white', 'rosé', 'sparkling', 'dessert'],
        message: 'Style must be one of: red, white, rosé, sparkling, dessert',
      },
    },
    alcohol: {
      type: Number,
      required: [true, 'Alcohol content is required'],
      min: [0, 'Alcohol content cannot be negative'],
      max: [50, 'Alcohol content cannot exceed 50%'],
    },
    tastingNotes: {
      type: wineTastingNotesSchema,
      required: [true, 'Tasting notes are required'],
    },
    ratings: {
      type: wineRatingsSchema,
      default: {},
    },
    cellar: {
      type: wineCellarSchema,
      required: [true, 'Cellar information is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
wineSchema.index({ userId: 1, createdAt: -1 });
wineSchema.index({ userId: 1, style: 1 });
wineSchema.index({ userId: 1, 'region.country': 1 });
wineSchema.index({ userId: 1, vintage: 1 });
wineSchema.index({ userId: 1, producer: 1 });
wineSchema.index({ userId: 1, name: 'text', producer: 'text' });

export const Wine = model<IWine>('Wine', wineSchema);
