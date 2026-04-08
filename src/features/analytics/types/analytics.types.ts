export interface DaySalesResponse {
  dayName: string;
  dayIndex: number;
  totalSales: number;
  unitsSold: number;
}

export interface ProductPerformanceItem {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
  ordersCount: number;
  rank: number | null;
  trend: string;
}

export interface TopProductsResponse {
  period: string;
  products: ProductPerformanceItem[];
}

/** Returned by GET /analytics/sales/trend — one entry per period */
export interface SalesSummaryResponse {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  completionRate: number;
  periodDate?: string;
}

/** Returned by GET /analytics/sales/summary?startDate=&endDate= */
export interface SalesTrendDataPoint {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface SalesReportResponse {
  periodLabel: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  completionRate: number;
  cancellationRate: number;
  newCustomers: number;
  returningCustomers: number;
  trend: SalesTrendDataPoint[];
}

/** Alert for low / out-of-stock products */
export interface ProductAlertResponse {
  productId: string;
  productName: string;
  stockLevel: number;
  alertType: string; // 'LOW_STOCK' | 'OUT_OF_STOCK'
}

export interface OrderSummaryResponse {
  orderId: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  orderedAt: string;
}

export interface DashboardMetricResponse {
  name: string;
  value: number;
  previousValue?: number;
  changePercentage?: number;
  trend: string; // 'UP' | 'DOWN' | 'STABLE'
  label?: string;
}

/** Returned by GET /analytics/dashboard */
export interface DashboardResponse {
  todayRevenue: number;
  todayOrders: number;
  todayBookings: number;
  activeCustomers: number;

  monthRevenue: number;
  monthOrders: number;
  monthGrowth: number;

  topProducts: ProductPerformanceItem[];
  recentOrders: OrderSummaryResponse[];
  lowStockAlerts: ProductAlertResponse[];
  metrics: DashboardMetricResponse[];
}

export type AnalyticsPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
