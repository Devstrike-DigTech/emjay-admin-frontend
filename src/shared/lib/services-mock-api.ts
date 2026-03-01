// Mock API for Services
// Replace these functions with real API calls when backend is ready

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Service Appointments
export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  service: string;
  customerName: string;
  customerAvatar: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    date: '2026-03-02',
    startTime: '10:00',
    endTime: '11:00',
    service: 'Hair',
    customerName: 'Sarah Johnson',
    customerAvatar: 'https://i.pravatar.cc/150?img=1',
    status: 'CONFIRMED',
  },
  {
    id: '2',
    date: '2026-03-04',
    startTime: '10:00',
    endTime: '11:00',
    service: 'Make Up',
    customerName: 'Emily Davis',
    customerAvatar: 'https://i.pravatar.cc/150?img=5',
    status: 'CONFIRMED',
  },
  {
    id: '3',
    date: '2026-03-06',
    startTime: '10:00',
    endTime: '11:00',
    service: 'Nails',
    customerName: 'Jessica Wilson',
    customerAvatar: 'https://i.pravatar.cc/150?img=9',
    status: 'CONFIRMED',
  },
  {
    id: '4',
    date: '2026-03-12',
    startTime: '10:00',
    endTime: '11:00',
    service: 'Make Up',
    customerName: 'Maria Garcia',
    customerAvatar: 'https://i.pravatar.cc/150?img=10',
    status: 'CONFIRMED',
  },
  {
    id: '5',
    date: '2026-03-16',
    startTime: '10:00',
    endTime: '11:00',
    service: 'Make Up',
    customerName: 'Amanda Lee',
    customerAvatar: 'https://i.pravatar.cc/150?img=20',
    status: 'CONFIRMED',
  },
  {
    id: '6',
    date: '2026-03-18',
    startTime: '10:00',
    endTime: '11:00',
    service: 'Nails',
    customerName: 'Lisa Brown',
    customerAvatar: 'https://i.pravatar.cc/150?img=25',
    status: 'PENDING',
  },
  {
    id: '7',
    date: '2026-03-24',
    startTime: '10:00',
    endTime: '11:00',
    service: 'Make Up',
    customerName: 'Rachel Taylor',
    customerAvatar: 'https://i.pravatar.cc/150?img=30',
    status: 'CONFIRMED',
  },
  {
    id: '8',
    date: '2026-03-02',
    startTime: '14:00',
    endTime: '15:00',
    service: 'Nails',
    customerName: 'Jennifer White',
    customerAvatar: 'https://i.pravatar.cc/150?img=12',
    status: 'CONFIRMED',
  },
  {
    id: '9',
    date: '2026-03-12',
    startTime: '15:00',
    endTime: '16:00',
    service: 'Hair',
    customerName: 'Michelle Green',
    customerAvatar: 'https://i.pravatar.cc/150?img=15',
    status: 'PENDING',
  },
];

// Mock Service Categories
export interface ServiceCategory {
  id: string;
  name: string;
  subcategories: string[];
}

const mockServiceCategories: ServiceCategory[] = [
  {
    id: 'makeup',
    name: 'Make up',
    subcategories: ['Bridal Make Up', 'Birthday Make up', 'Glitter Make Up'],
  },
  {
    id: 'nails',
    name: 'Nails',
    subcategories: ['Long Nails', 'Short Nails', 'Acrylic Nails'],
  },
  {
    id: 'hair',
    name: 'Hair',
    subcategories: ['Weaving', 'Braiding', 'Attachment'],
  },
];

// Mock Service Stats
export interface ServiceStats {
  mostBookedService: {
    name: string;
    orders: number;
    change: number;
  };
  totalOrders: {
    count: number;
    change: number;
  };
  mostBookedDay: {
    day: string;
    orders: number;
    change: number;
  };
  lowestOrders: {
    name: string;
    orders: number;
    change: number;
  };
}

const mockServiceStats: ServiceStats = {
  mostBookedService: {
    name: 'Nails',
    orders: 300,
    change: 36,
  },
  totalOrders: {
    count: 50,
    change: 36,
  },
  mostBookedDay: {
    day: 'Friday',
    orders: 300,
    change: 36,
  },
  lowestOrders: {
    name: 'Male Grooming',
    orders: 0,
    change: 36,
  },
};

// Mock Services List
export interface Service {
  id: string;
  name: string;
  categoryId: string;
  subcategory?: string;
  description: string;
  durationMinutes: number;
  basePrice: number;
  isActive: boolean;
}

const mockServices: Service[] = [
  // Makeup Services
  {
    id: 's1',
    name: 'Bridal Makeup Package',
    categoryId: 'makeup',
    subcategory: 'Bridal Make Up',
    description: 'Complete bridal makeup with trial session',
    durationMinutes: 120,
    basePrice: 50000,
    isActive: true,
  },
  {
    id: 's2',
    name: 'Birthday Glam',
    categoryId: 'makeup',
    subcategory: 'Birthday Make up',
    description: 'Fun and festive birthday makeup',
    durationMinutes: 60,
    basePrice: 20000,
    isActive: true,
  },
  {
    id: 's3',
    name: 'Glitter Party Makeup',
    categoryId: 'makeup',
    subcategory: 'Glitter Make Up',
    description: 'Sparkly makeup for parties and events',
    durationMinutes: 90,
    basePrice: 25000,
    isActive: true,
  },
  // Nails Services
  {
    id: 's4',
    name: 'Acrylic Full Set',
    categoryId: 'nails',
    subcategory: 'Acrylic Nails',
    description: 'Full set of acrylic nails with design',
    durationMinutes: 120,
    basePrice: 15000,
    isActive: true,
  },
  {
    id: 's5',
    name: 'Long Nails Extension',
    categoryId: 'nails',
    subcategory: 'Long Nails',
    description: 'Nail extension for long nails',
    durationMinutes: 90,
    basePrice: 12000,
    isActive: true,
  },
  {
    id: 's6',
    name: 'Short Nails Manicure',
    categoryId: 'nails',
    subcategory: 'Short Nails',
    description: 'Professional manicure for short nails',
    durationMinutes: 45,
    basePrice: 8000,
    isActive: true,
  },
  // Hair Services
  {
    id: 's7',
    name: 'Hair Weaving',
    categoryId: 'hair',
    subcategory: 'Weaving',
    description: 'Professional hair weaving service',
    durationMinutes: 180,
    basePrice: 30000,
    isActive: true,
  },
  {
    id: 's8',
    name: 'Box Braids',
    categoryId: 'hair',
    subcategory: 'Braiding',
    description: 'Stylish box braids',
    durationMinutes: 240,
    basePrice: 25000,
    isActive: true,
  },
  {
    id: 's9',
    name: 'Hair Attachment',
    categoryId: 'hair',
    subcategory: 'Attachment',
    description: 'Hair attachment installation',
    durationMinutes: 120,
    basePrice: 20000,
    isActive: true,
  },
];

// Mock API Functions
export const servicesApi = {
  /**
   * Get all appointments
   */
  getAppointments: async (): Promise<Appointment[]> => {
    await delay(400);
    return mockAppointments;
  },

  /**
   * Get appointments for a specific date range
   */
  getAppointmentsByDateRange: async (startDate: string, endDate: string): Promise<Appointment[]> => {
    await delay(300);
    return mockAppointments.filter(apt => apt.date >= startDate && apt.date <= endDate);
  },

  /**
   * Get single appointment by ID
   */
  getAppointmentById: async (id: string): Promise<Appointment | null> => {
    await delay(200);
    return mockAppointments.find(apt => apt.id === id) || null;
  },

  /**
   * Get service categories
   */
  getServiceCategories: async (): Promise<ServiceCategory[]> => {
    await delay(200);
    return mockServiceCategories;
  },

  /**
   * Get service stats
   */
  getServiceStats: async (): Promise<ServiceStats> => {
    await delay(500);
    return mockServiceStats;
  },

  /**
   * Get all services
   */
  getServices: async (): Promise<Service[]> => {
    await delay(300);
    return mockServices;
  },

  /**
   * Get services by category
   */
  getServicesByCategory: async (categoryId: string): Promise<Service[]> => {
    await delay(300);
    return mockServices.filter(s => s.categoryId === categoryId);
  },

  /**
   * Create new appointment
   */
  createAppointment: async (data: Omit<Appointment, 'id'>): Promise<Appointment> => {
    await delay(500);
    const newAppointment: Appointment = {
      ...data,
      id: `apt_${Date.now()}`,
    };
    mockAppointments.push(newAppointment);
    return newAppointment;
  },

  /**
   * Update appointment
   */
  updateAppointment: async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    await delay(500);
    const index = mockAppointments.findIndex(apt => apt.id === id);
    if (index === -1) throw new Error('Appointment not found');
    
    mockAppointments[index] = { ...mockAppointments[index], ...data };
    return mockAppointments[index];
  },

  /**
   * Cancel appointment
   */
  cancelAppointment: async (id: string): Promise<void> => {
    await delay(400);
    const index = mockAppointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      mockAppointments[index].status = 'CANCELLED';
    }
  },

  /**
   * Delete appointment
   */
  deleteAppointment: async (id: string): Promise<void> => {
    await delay(400);
    const index = mockAppointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      mockAppointments.splice(index, 1);
    }
  },
};