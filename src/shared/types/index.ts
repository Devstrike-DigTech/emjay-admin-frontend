// User & Auth Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  createdAt: string;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  categoryId: string;
  brandId?: string;
  basePrice: number;
  costPrice?: number;
  stockQuantity: number;
  reorderLevel: number;
  unit: string;
  weight?: number;
  weightUnit?: string;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  displayOrder: number;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  website?: string;
  country?: string;
}

// Service Types
export interface Service {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  basePrice: number;
  durationMinutes: number;
  bufferTimeMinutes?: number;
  requiresDeposit: boolean;
  depositAmount?: number;
  isActive: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  staffId: string;
  customerId: string;
  bookingDate: string;
  startTime: string;
  endTime?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  totalAmount: number;
  notes?: string;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  status: 'PENDING_PAYMENT' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  orderedAt: string;
}

// Staff Types
export interface Staff {
  id: string;
  userId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  monthlySalary?: number;
}

// Analytics Types
export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  completionRate: number;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
  rank?: number;
}

// Pagination
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}
