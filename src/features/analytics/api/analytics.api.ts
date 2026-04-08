import { apiClient } from '@/shared/lib/api-client';
import {
  DaySalesResponse,
  TopProductsResponse,
  SalesReportResponse,
  SalesSummaryResponse,
  DashboardResponse,
  AnalyticsPeriod,
} from '../types/analytics.types';

export const analyticsApi = {
  getSalesByDay: () =>
    apiClient.get<DaySalesResponse[]>('/analytics/sales/by-day'),

  getTopProducts: (period: AnalyticsPeriod = 'MONTHLY', limit: number = 10) =>
    apiClient.get<TopProductsResponse>('/analytics/products/top', {
      params: { period, limit },
    }),

  /**
   * GET /analytics/sales/summary — requires date range params.
   * Returns a full SalesReportResponse (with trend array, completion rate, etc.)
   */
  getSalesSummary: (startDate: string, endDate: string) =>
    apiClient.get<SalesReportResponse>('/analytics/sales/summary', {
      params: { startDate, endDate },
    }),

  /**
   * GET /analytics/sales/trend — returns one SalesSummaryResponse per period bucket.
   */
  getSalesTrend: (period: AnalyticsPeriod = 'MONTHLY', count: number = 12) =>
    apiClient.get<SalesSummaryResponse[]>('/analytics/sales/trend', {
      params: { period, count },
    }),

  getDashboard: () =>
    apiClient.get<DashboardResponse>('/analytics/dashboard'),
};
