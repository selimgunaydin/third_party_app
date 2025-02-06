import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface Customer {
  userId: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  lastVisit: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'blocked';
  
  lastLocation: {
    country?: string;
    city?: string;
    ip?: string;
    timezone?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };

  analytics: {
    totalVisits: number;
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    productViews: number;
    addToCartCount: number;
    lastOrderDate?: string;
    conversionRate: number;
    abandonedCarts: number;
    totalRefunds: number;
    refundRate: number;
    lastRefundDate?: string;
    averageSessionDuration: number;
    bounceRate: number;
    loyaltyPoints: number;
    customerLifetimeValue: number;
  };

  recentlyViewedProducts: Array<{
    productId: string;
    name: string;
    price: number;
    viewedAt: string;
  }>;

  searchHistory: Array<{
    query: string;
    timestamp: string;
    resultCount: number;
    category?: string;
  }>;

  deviceInfo: {
    browser?: string;
    browserVersion?: string;
    os?: string;
    osVersion?: string;
    device?: string;
    deviceType?: 'mobile' | 'tablet' | 'desktop';
    screenResolution?: string;
    language?: string;
  };

  preferences: {
    favoriteCategories: string[];
    preferredPaymentMethod?: string;
    newsletter: boolean;
    marketingConsent: boolean;
    communicationPreferences: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    currency?: string;
    language?: string;
    theme?: 'light' | 'dark' | 'system';
  };

  shipping: {
    addresses: Array<{
      id: string;
      title: string;
      fullName: string;
      address: string;
      city: string;
      country: string;
      postalCode: string;
      phone?: string;
      isDefault: boolean;
    }>;
    preferredCarrier?: string;
  };

  payment: {
    methods: Array<{
      id: string;
      type: 'credit_card' | 'bank_transfer' | 'digital_wallet';
      provider?: string;
      lastUsed?: string;
      isDefault: boolean;
      maskedNumber?: string;
    }>;
    billingAddresses: Array<{
      id: string;
      title: string;
      fullName: string;
      address: string;
      city: string;
      country: string;
      postalCode: string;
      phone?: string;
      isDefault: boolean;
    }>;
  };

  social: {
    referralCode?: string;
    referredBy?: string;
    totalReferrals: number;
    connectedAccounts: Array<{
      platform: string;
      username: string;
      connected: boolean;
    }>;
  };

  segments: Array<{
    id: string;
    name: string;
    type: string;
    addedAt: string;
  }>;

  tags: string[];
  notes: Array<{
    id: string;
    content: string;
    createdAt: string;
    createdBy: string;
    type: 'support' | 'sales' | 'general';
  }>;
}

interface CustomerAnalytics {
  customer: Customer;
  analytics: {
    mostViewedProducts: Array<{
      _id: string;
      viewCount: number;
      productName: string;
      productPrice: number;
      lastViewed: string;
      category?: string;
      timeSpent: number;
      addedToCart: boolean;
      purchased: boolean;
    }>;
    mostAddedToCart: Array<{
      _id: string;
      addToCartCount: number;
      productName: string;
      productPrice: number;
      lastAdded: string;
      purchaseRate: number;
      averageTimeToCheckout: number;
    }>;
    orderStats: {
      totalOrders: number;
      totalAmount: number;
      averageOrderAmount: number;
      minOrderAmount: number;
      maxOrderAmount: number;
      orderFrequency: number;
      preferredOrderDays: string[];
      preferredOrderTimes: string[];
      seasonalOrderTrends: Array<{
        season: string;
        orderCount: number;
        totalAmount: number;
      }>;
      categoryBreakdown: Array<{
        category: string;
        orderCount: number;
        totalAmount: number;
        percentage: number;
      }>;
    };
    timeBasedStats: Array<{
      _id: string;
      events: Array<{
        eventName: string;
        count: number;
        value?: number;
        metadata?: Record<string, any>;
      }>;
      totalEvents: number;
      uniqueEvents: number;
      peakHours: Array<{
        hour: number;
        count: number;
      }>;
    }>;
    engagementMetrics: {
      averageSessionDuration: number;
      sessionsPerMonth: number;
      pageViewsPerSession: number;
      bounceRate: number;
      retentionRate: number;
      lastEngagement: string;
      engagementScore: number;
      interactionsByType: Record<string, number>;
    };
    customerJourney: Array<{
      stage: string;
      enteredAt: string;
      completedAt?: string;
      duration: number;
      touchpoints: Array<{
        type: string;
        timestamp: string;
        channel: string;
        outcome: string;
      }>;
    }>;
  };
}

interface CustomersResponse {
  customers: Customer[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  summary: {
    totalCustomers: number;
    activeCustomers: number;
    newCustomersToday: number;
    averageLifetimeValue: number;
    topSegments: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
    customersByStatus: Record<string, number>;
  };
}

export function useCustomers({ page = 1, limit = 10 } = {}) {
  return useQuery<CustomersResponse>({
    queryKey: ['customers', { page, limit }],
    queryFn: async () => {
      const response = await api.get('/customers', {
        params: { page, limit },
      });
      return response.data;
    },
  });
}

export function useCustomerAnalytics(customerId: string | null) {
  return useQuery<CustomerAnalytics>({
    queryKey: ['customer', customerId, 'analytics'],
    queryFn: async () => {
      const response = await api.get(`/customers/${customerId}/analytics`);
      return response.data;
    },
    enabled: !!customerId,
  });
} 