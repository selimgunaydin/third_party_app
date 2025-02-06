import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from '../schemas/customer.schema';
import { AnalyticsService } from '../analytics/analytics.service';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
    @Inject(forwardRef(() => AnalyticsService))
    private readonly analyticsService: AnalyticsService,
  ) {}

  async updateCustomerFromEvent(eventData: {
    userId: string;
    eventName: string;
    eventData: Record<string, any>;
    ipAddress: string;
    userAgent: string;
  }) {
    try {
      let customer = await this.customerModel.findOne({ userId: eventData.userId });

      
      if (!customer) {
        customer = new this.customerModel({
          userId: eventData.userId,
          lastVisit: new Date(),
          analytics: {
            totalVisits: 0,
            totalOrders: 0,
            totalSpent: 0,
            averageOrderValue: 0,
            productViews: 0,
            addToCartCount: 0,
          },
          preferences: {
            favoriteCategories: [],
            newsletter: false,
          },
        });
      }

      // Update last visit
      customer.lastVisit = new Date();
      
      // Update location info
      customer.lastLocation = {
        ip: eventData.ipAddress,
      };

      // Update analytics based on event type
      switch (eventData.eventName) {
        case 'PRODUCT_VIEWED':
          customer.analytics.productViews++;
          if (eventData.eventData.productId) {
            customer.recentlyViewedProducts = [
              eventData.eventData.productId,
              ...(customer.recentlyViewedProducts || []).slice(0, 9),
            ];
          }
          break;

        case 'ADD_TO_CART':
          customer.analytics.addToCartCount++;
          break;

        case 'CHECKOUT_COMPLETED':
          customer.analytics.totalOrders++;
          customer.analytics.totalSpent += eventData.eventData.total || 0;
          customer.analytics.averageOrderValue = 
            customer.analytics.totalSpent / customer.analytics.totalOrders;
          customer.analytics.lastOrderDate = new Date();
          break;

        case 'SEARCH':
          if (eventData.eventData.query) {
            customer.searchHistory = [
              eventData.eventData.query,
              ...(customer.searchHistory || []).slice(0, 9),
            ];
          }
          break;
      }

      await customer.save();
      return customer;
    } catch (error) {
      this.logger.error('Error updating customer from event:', error);
      throw error;
    }
  }

  async getCustomerAnalytics(userId: string) {
    try {
      const customer = await this.customerModel.findOne({ userId });
      if (!customer) {
        return null;
      }

      const [
        mostViewedProducts,
        mostAddedToCart,
        orderStats,
        timeBasedStats
      ] = await Promise.all([
        this.analyticsService.getMostViewedProductsByCustomerId(userId),
        this.analyticsService.getMostAddedToCartProductsByCustomerId(userId),
        this.analyticsService.getOrderStatisticsByCustomerId(userId),
        this.analyticsService.getTimeBasedAnalyticsByCustomerId(userId),
      ]);

      return {
        customer,
        analytics: {
          mostViewedProducts,
          mostAddedToCart,
          orderStats,
          timeBasedStats,
        },
      };
    } catch (error) {
      this.logger.error('Error getting customer analytics:', error);
      throw error;
    }
  }

  async getCustomersList(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [customers, total] = await Promise.all([
        this.customerModel
          .find()
          .sort({ lastVisit: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.customerModel.countDocuments(),
      ]);

      return {
        customers,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Error getting customers list:', error);
      throw error;
    }
  }
} 