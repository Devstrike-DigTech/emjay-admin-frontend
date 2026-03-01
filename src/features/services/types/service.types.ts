// Service and Appointment types

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

export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  serviceId: string;
  serviceName: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  totalAmount: number;
  notes?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  services: string[];
}