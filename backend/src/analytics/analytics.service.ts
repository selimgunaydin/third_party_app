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
    websiteId: string;
    eventName: string;
    eventData: Record<string, any>;
    userId?: string;
    sessionId: string;
    userAgent: string;
    ipAddress: string;
    referrer: string;
    path: string;
    metadata?: Record<string, any>;
  }) {
    const event = new this.analyticsModel(eventData);
    return await event.save();
  }

  async getEventsByWebsiteId(websiteId: string, startDate?: Date, endDate?: Date) {
    const query: any = { websiteId };
    
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

  async getEventsByUserId(websiteId: string, userId: string) {
    return await this.analyticsModel
      .find({ websiteId, userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getEventAggregations(websiteId: string, startDate: Date, endDate: Date) {
    return await this.analyticsModel.aggregate([
      {
        $match: {
          websiteId,
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

  async getUserSessionsCount(websiteId: string, startDate: Date, endDate: Date) {
    return await this.analyticsModel.distinct('sessionId', {
      websiteId,
      createdAt: { $gte: startDate, $lte: endDate },
    });
  }
} 