import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnalyticsDocument = Analytics & Document;

@Schema({ timestamps: true })
export class Analytics {
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
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics); 