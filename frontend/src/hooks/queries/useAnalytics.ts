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

export const useAggregations = (params?: AnalyticsParams) => {
  return useQuery({
    queryKey: ['aggregations', params?.startDate, params?.endDate],
    queryFn: () => analytics.getAggregations(params?.startDate, params?.endDate),
  });
};

export const useSessions = (params?: AnalyticsParams) => {
  return useQuery({
    queryKey: ['sessions', params?.startDate, params?.endDate],
    queryFn: () => analytics.getSessions(params?.startDate, params?.endDate),
  });
}; 