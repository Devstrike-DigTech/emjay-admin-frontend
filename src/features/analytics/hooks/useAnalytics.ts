import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics.api';
import { AnalyticsPeriod } from '../types/analytics.types';

export function useSalesByDay() {
  return useQuery({
    queryKey: ['analytics', 'sales-by-day'],
    queryFn: () => analyticsApi.getSalesByDay(),
  });
}

export function useTopProducts(period: AnalyticsPeriod = 'MONTHLY', limit: number = 10) {
  return useQuery({
    queryKey: ['analytics', 'top-products', period, limit],
    queryFn: () => analyticsApi.getTopProducts(period, limit),
  });
}

/**
 * Fetch a sales report for a specific date range (YYYY-MM-DD strings).
 */
export function useSalesSummary(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['analytics', 'sales-summary', startDate, endDate],
    queryFn: () => analyticsApi.getSalesSummary(startDate, endDate),
    enabled: Boolean(startDate && endDate),
  });
}

export function useSalesTrend(period: AnalyticsPeriod = 'MONTHLY', count: number = 12) {
  return useQuery({
    queryKey: ['analytics', 'sales-trend', period, count],
    queryFn: () => analyticsApi.getSalesTrend(period, count),
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => analyticsApi.getDashboard(),
  });
}
