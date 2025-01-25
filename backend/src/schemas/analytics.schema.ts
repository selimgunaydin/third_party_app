import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface IAnalytics {
  apiKey: string;
  eventName: string;
  eventData: Record<string, any>;
  sessionId: string;
  userAgent: string;
  ipAddress: string;
  referrer: string;
  path: string;
  metadata?: Record<string, any>;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AnalyticsDocument = Analytics & Document;

@Schema({
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
    transform: (_, ret: Record<string, any>) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Analytics implements IAnalytics {
  @Prop({ required: true })
  apiKey: string;

  @Prop({ required: true })
  eventName: string;

  @Prop({ type: Object })
  eventData: Record<string, any>;

  @Prop()
  sessionId: string;

  @Prop()
  userAgent: string;

  @Prop()
  ipAddress: string;

  @Prop()
  referrer: string;

  @Prop()
  path: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ required: true })
  userId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  toObject(): IAnalytics {
    return {
      apiKey: this.apiKey,
      eventName: this.eventName,
      eventData: this.eventData,
      sessionId: this.sessionId,
      userAgent: this.userAgent,
      ipAddress: this.ipAddress,
      referrer: this.referrer,
      path: this.path,
      metadata: this.metadata,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics); 