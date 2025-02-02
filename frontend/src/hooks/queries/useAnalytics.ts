import { useQuery } from '@tanstack/react-query';
import { analytics } from '@/lib/api';

interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
}

export const useEvents = (params?: AnalyticsParams) => {
  return useQuery({
    queryKey: ['events', params?.startDate, params?.endDate],
    queryFn: () => analytics.getEvents(params?.startDate, params?.endDate),
  });
};

export const useMostViewedProducts = () => {
  return useQuery({
    queryKey: ['most-viewed-products'],
    queryFn: () => analytics.getMostViewedProducts(),
  });
};

export const useMostAddedProducts = () => {
  return useQuery({
    queryKey: ['most-added-products'],
    queryFn: () => analytics.getMostAddedProducts(),
  });
};

export const useOrderStatistics = () => {
  return useQuery({
    queryKey: ['order-statistics'],
    queryFn: () => analytics.getOrderStatistics(),
  });
};

export const useTimeBasedAnalytics = () => {
  return useQuery({
    queryKey: ['time-based-analytics'],
    queryFn: () => analytics.getTimeBasedAnalytics(),
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