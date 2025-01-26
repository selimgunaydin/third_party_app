import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async getMostViewedProducts(limit = 10): Promise<any[]> {
    try {
      const result = await this.analyticsModel.aggregate([
        {
          $match: {
            eventName: 'PRODUCT_VIEWED',
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

  async getMostAddedToCartProducts(limit = 10): Promise<any[]> {
    try {
      const result = await this.analyticsModel.aggregate([
        {
          $match: {
            eventName: 'ADD_TO_CART',
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

  async getOrderStatistics(): Promise<any> {
    try {
      const result = await this.analyticsModel.aggregate([
        {
          $match: {
            eventName: 'CHECKOUT_COMPLETED',
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

  async getTimeBasedAnalytics(days = 30): Promise<any> {
    try {
      const date = new Date();
      date.setDate(date.getDate() - days);

      const result = await this.analyticsModel.aggregate([
        {
          $match: {
            createdAt: { $gte: date },
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
} 