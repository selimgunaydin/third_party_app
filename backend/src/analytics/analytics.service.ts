import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Analytics, AnalyticsDocument } from '../schemas/analytics.schema';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

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
    eventData.eventName = eventData.eventName.toUpperCase();
    const event = new this.analyticsModel(eventData);
    return await event.save();
  }

  async getEventsByUserId(userId: string, startDate?: Date, endDate?: Date) {
    const query: any = { userId };
    
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

  async getMostViewedProducts(userId: string, limit = 10): Promise<any[]> {
    try {
      const result = await this.analyticsModel.aggregate([
        {
          $match: {
            eventName: 'PRODUCT_VIEWED',
            userId: userId.toString(),
          },
        },
        {
          $group: {
            _id: '$eventData.productId',
            viewCount: { $sum: 1 },
            productName: { $first: '$eventData.name' },
            productPrice: { $first: '$eventData.price' }, 
            lastViewed: { $max: '$createdAt' },
          },
        },
        {
          $sort: { viewCount: -1 },
        },
        {
          $limit: limit,
        },
      ]);

      return result;
    } catch (error) {
      this.logger.error('Error in getMostViewedProducts:', error);
      throw error;
    }
  }

  async getMostAddedToCartProducts(userId: string, limit = 10): Promise<any[]> {
    try {
      const result = await this.analyticsModel.aggregate([
        {
          $match: {
            eventName: 'ADD_TO_CART',
            userId: userId.toString(),
          },
        },
        {
          $group: {
            _id: '$eventData.productId',
            addToCartCount: { $sum: 1 },
            productName: { $first: '$eventData.name' },
            productPrice: { $first: '$eventData.price' },
            lastAdded: { $max: '$createdAt' },
          },
        },
        {
          $sort: { addToCartCount: -1 },
        },
        {
          $limit: limit,
        },
      ]);

      return result;
    } catch (error) {
      this.logger.error('Error in getMostAddedToCartProducts:', error);
      throw error;
    }
  }

  async getOrderStatistics(userId: string): Promise<any> {
    try {
      const result = await this.analyticsModel.aggregate([
        {
          $match: {
            eventName: 'CHECKOUT_COMPLETED',
            userId: userId.toString(),
          },
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalAmount: { $sum: '$eventData.total' },
            averageOrderAmount: { $avg: '$eventData.total' },
            minOrderAmount: { $min: '$eventData.total' },
            maxOrderAmount: { $max: '$eventData.total' },
          },
        },
      ]);

      return result[0] || {
        totalOrders: 0,
        totalAmount: 0,
        averageOrderAmount: 0,
        minOrderAmount: 0,
        maxOrderAmount: 0,
      };
    } catch (error) {
      this.logger.error('Error in getOrderStatistics:', error);
      throw error;
    }
  }

  async getTimeBasedAnalytics(userId: string, days = 30): Promise<any> {
    try {
      const date = new Date();
      date.setDate(date.getDate() - days);

      const result = await this.analyticsModel.aggregate([
        {
          $match: {
            createdAt: { $gte: date },
            userId: userId.toString(),
          },
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              eventName: '$eventName',
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: '$_id.date',
            events: {
              $push: {
                eventName: '$_id.eventName',
                count: '$count',
              },
            },
            totalEvents: { $sum: '$count' },
          },
        },
        {
          $sort: { '_id': 1 },
        },
      ]);
      return result;
    } catch (error) {
      this.logger.error('Error in getTimeBasedAnalytics:', error);
      throw error;
    }
  }

  async getPageDurationStats(userId: string, path?: string, startDate?: Date, endDate?: Date) {
    try {
      const query: any = {
        eventName: 'PAGE_DURATION',
        userId: userId.toString(),
      };

      if (path) {
        query['eventData.path'] = { 
          $regex: path, 
          $options: 'i' 
        };
      }

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = startDate;
        if (endDate) query.createdAt.$lte = endDate;
      }

      const result = await this.analyticsModel.aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: '$eventData.path',
            averageDuration: { $avg: '$eventData.duration' },
            totalDuration: { $sum: '$eventData.duration' },
            visits: { $sum: 1 },
            minDuration: { $min: '$eventData.duration' },
            maxDuration: { $max: '$eventData.duration' },
            lastVisit: { $max: '$eventData.endTime' },
          },
        },
        {
          $project: {
            path: '$_id',
            averageDuration: { $round: ['$averageDuration', 2] },
            totalDuration: 1,
            visits: 1,
            minDuration: 1,
            maxDuration: 1,
            lastVisit: 1,
            _id: 0,
          },
        },
        {
          $sort: { visits: -1 },
        },
      ]);

      return result;
    } catch (error) {
      this.logger.error('Error in getPageDurationStats:', error);
      throw error;
    }
  }

  async getDetailedPageDuration(userId: string, path: string, limit = 100) {
    try {
      return await this.analyticsModel
        .find({
          eventName: 'PAGE_DURATION',
          userId: userId.toString(),
          'eventData.path': { 
            $regex: path, 
            $options: 'i' 
          },
        })
        .sort({ 'eventData.startTime': -1 })
        .limit(limit)
        .select('eventData createdAt')
        .exec();
    } catch (error) {
      this.logger.error('Error in getDetailedPageDuration:', error);
      throw error;
    }
  }
} 