import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Analytics, AnalyticsDocument } from '../schemas/analytics.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics.name)
    private readonly analyticsModel: Model<AnalyticsDocument>,
  ) {}

  async trackEvent(eventData: {
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
  }) {
    const event = new this.analyticsModel(eventData);
    return await event.save();
  }

  async getEventsByApiKey(apiKey: string, startDate?: Date, endDate?: Date) {
    const query: any = { apiKey };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    return await this.analyticsModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();
  }

  async getEventAggregations(userId: string, startDate: Date, endDate: Date) {
    return await this.analyticsModel.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$eventName',
          count: { $sum: 1 },
        },
      },
    ]);
  }

  async getUserSessionsCount(userId: string, startDate: Date, endDate: Date) {
    return await this.analyticsModel.distinct('sessionId', {
      userId,
      createdAt: { $gte: startDate, $lte: endDate },
    });
  }
} 