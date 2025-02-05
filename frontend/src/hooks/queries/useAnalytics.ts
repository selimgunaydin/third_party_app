import { useQuery } from '@tanstack/react-query';
import { analytics } from '@/lib/api';

interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
}

interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  viewCount: number;
  addToCartCount: number;
}

interface TimeBasedEvent {
  eventName: string;
  count: number;
}

interface TimeBasedAnalytics {
  events: TimeBasedEvent[];
  totalEvents: number;
}

interface OrderStatistics {
  totalOrders: number;
  totalAmount: number;
  averageOrderAmount: number;
  minOrderAmount: number;
  maxOrderAmount: number;
}

export const useEvents = (params?: AnalyticsParams) => {
  return useQuery({
    queryKey: ['events', params?.startDate, params?.endDate],
    queryFn: () => analytics.getEvents(params?.startDate, params?.endDate),
  });
};

export const useMostViewedProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['most-viewed-products'],
    queryFn: () => analytics.getMostViewedProducts(),
  });
};

export const useMostAddedProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['most-added-products'],
    queryFn: () => analytics.getMostAddedProducts(),
  });
};

export const useOrderStatistics = () => {
  return useQuery<OrderStatistics>({
    queryKey: ['order-statistics'],
    queryFn: () => analytics.getOrderStatistics(),
  });
};

export const useTimeBasedAnalytics = () => {
  return useQuery<TimeBasedAnalytics[]>({
    queryKey: ['time-based-analytics'],
    queryFn: () => analytics.getTimeBasedAnalytics(),
  });
};

export const useMostSearchedProducts = (productId: string, limit?: number) => {
  return useQuery<Product[]>({
    queryKey: ['most-searched-products', productId, limit],
    queryFn: () => analytics.getMostSearchedProducts(productId, limit),
  });
};

interface PageDurationParams {
  path?: string;
  startDate?: string;
  endDate?: string;
}

export const usePageDurationStats = (params?: PageDurationParams) => {
  return useQuery({
    queryKey: ['page-duration-stats', params?.path, params?.startDate, params?.endDate],
    queryFn: () => analytics.getPageDurationStats(params?.path, params?.startDate, params?.endDate),
  });
};

export const useDetailedPageDuration = (path: string, limit?: number) => {
  return useQuery({
    queryKey: ['detailed-page-duration', path, limit],
    queryFn: () => analytics.getDetailedPageDuration(path, limit),
  });
};