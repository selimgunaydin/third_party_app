import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  lastVisit: Date;

  @Prop({ type: Object })
  lastLocation: {
    country?: string;
    city?: string;
    ip?: string;
  };

  @Prop({ type: Object })
  analytics: {
    totalVisits: number;
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    productViews: number;
    addToCartCount: number;
    lastOrderDate?: Date;
  };

  @Prop({ type: [String], default: [] })
  recentlyViewedProducts: string[];

  @Prop({ type: [String], default: [] })
  searchHistory: string[];

  @Prop({ type: Object })
  deviceInfo: {
    browser?: string;
    os?: string;
    device?: string;
  };

  @Prop({ type: Object })
  preferences: {
    favoriteCategories: string[];
    preferredPaymentMethod?: string;
    newsletter: boolean;
  };
}

export const CustomerSchema = SchemaFactory.createForClass(Customer); 