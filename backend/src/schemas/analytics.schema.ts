import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnalyticsDocument = Analytics & Document;

@Schema({ timestamps: true })
export class Analytics {
  @Prop({ required: true })
  websiteId: string;

  @Prop({ required: true })
  eventName: string;

  @Prop({ type: Object })
  eventData: Record<string, any>;

  @Prop()
  userId?: string;

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
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics); 