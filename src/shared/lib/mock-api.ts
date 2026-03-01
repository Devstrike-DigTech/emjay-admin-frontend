// Mock API responses for dashboard
// Replace these functions with real API calls when backend is ready

import { Product } from '@/features/products/types/product.types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Products Data with subcategories
const mockProducts: Product[] = [
  // Makeup products
  {
    id: '1',
    name: 'HD Foundation',
    sku: '34/9492/0',
    basePrice: 50000,
    costPrice: 35000,
    stockQuantity: 150,
    reorderLevel: 30,
    unit: 'piece',
    categoryId: 'makeup',
    subcategory: 'Foundations',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Makeup Kit',
    sku: '34/9492/0',
    basePrice: 80000,
    costPrice: 60000,
    stockQuantity: 300,
    reorderLevel: 50,
    unit: 'piece',
    categoryId: 'makeup',
    subcategory: 'Concealers & Color Correctors',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Finishing Powder',
    sku: '34/9492/0',
    basePrice: 35000,
    costPrice: 25000,
    stockQuantity: 200,
    reorderLevel: 40,
    unit: 'piece',
    categoryId: 'makeup',
    subcategory: 'Powder',
    imageUrl: 'https://images.unsplash.com/photo-1631214524020-7e18db7a8f86?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Matte Lipstick',
    sku: '34/9492/0',
    basePrice: 100000,
    costPrice: 80000,
    stockQuantity: 300,
    reorderLevel: 50,
    unit: 'piece',
    categoryId: 'makeup',
    subcategory: 'Lipstick',
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Eye Kajal',
    sku: '34/9492/0',
    basePrice: 25000,
    costPrice: 18000,
    stockQuantity: 250,
    reorderLevel: 50,
    unit: 'piece',
    categoryId: 'makeup',
    subcategory: 'Eyeliner & Kajal',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Volume Mascara',
    sku: '34/9492/0',
    basePrice: 45000,
    costPrice: 32000,
    stockQuantity: 180,
    reorderLevel: 35,
    unit: 'piece',
    categoryId: 'makeup',
    subcategory: 'Mascara',
    imageUrl: 'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Fragrances
  {
    id: '7',
    name: 'Floral Women Perfume',
    sku: '34/9492/0',
    basePrice: 120000,
    costPrice: 90000,
    stockQuantity: 100,
    reorderLevel: 20,
    unit: 'piece',
    categoryId: 'fragrances',
    subcategory: "Women's",
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Beard Oil',
    sku: '34/9492/0',
    basePrice: 80000,
    costPrice: 60000,
    stockQuantity: 300,
    reorderLevel: 50,
    unit: 'piece',
    categoryId: 'fragrances',
    subcategory: "Men's",
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Woody Men Cologne',
    sku: '34/9492/0',
    basePrice: 150000,
    costPrice: 110000,
    stockQuantity: 80,
    reorderLevel: 15,
    unit: 'piece',
    categoryId: 'fragrances',
    subcategory: "Men's",
    imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Personal Care
  {
    id: '10',
    name: 'Face Serum',
    sku: '34/9492/0',
    basePrice: 65000,
    costPrice: 45000,
    stockQuantity: 120,
    reorderLevel: 25,
    unit: 'piece',
    categoryId: 'personal-care',
    subcategory: 'Skincare',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '11',
    name: 'SPF 50 Sunscreen',
    sku: '34/9492/0',
    basePrice: 40000,
    costPrice: 28000,
    stockQuantity: 200,
    reorderLevel: 40,
    unit: 'piece',
    categoryId: 'personal-care',
    subcategory: 'Sunscreens & Tanning Products',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '12',
    name: 'Roll-On Deodorant',
    sku: '34/9492/0',
    basePrice: 18000,
    costPrice: 12000,
    stockQuantity: 350,
    reorderLevel: 70,
    unit: 'piece',
    categoryId: 'personal-care',
    subcategory: 'Deodorants & Antiperspirants',
    imageUrl: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '13',
    name: 'Lip Balm',
    sku: '34/9492/0',
    basePrice: 8000,
    costPrice: 5000,
    stockQuantity: 500,
    reorderLevel: 100,
    unit: 'piece',
    categoryId: 'personal-care',
    subcategory: 'Lip Care',
    imageUrl: 'https://images.unsplash.com/photo-1591360236480-4ed861025fa1?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Oral Care
  {
    id: '14',
    name: 'Whitening Toothpaste',
    sku: '34/9492/0',
    basePrice: 12000,
    costPrice: 8000,
    stockQuantity: 400,
    reorderLevel: 80,
    unit: 'piece',
    categoryId: 'oral-care',
    subcategory: 'Toothpaste',
    imageUrl: 'https://images.unsplash.com/photo-1622654862202-f85d4e92c028?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '15',
    name: 'Electric Toothbrush',
    sku: '34/9492/0',
    basePrice: 35000,
    costPrice: 25000,
    stockQuantity: 100,
    reorderLevel: 20,
    unit: 'piece',
    categoryId: 'oral-care',
    subcategory: 'Toothbrush',
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '16',
    name: 'Teeth Whitening Strips',
    sku: '34/9492/0',
    basePrice: 28000,
    costPrice: 20000,
    stockQuantity: 150,
    reorderLevel: 30,
    unit: 'piece',
    categoryId: 'oral-care',
    subcategory: 'Teeth Whitening',
    imageUrl: 'https://images.unsplash.com/photo-1609735189047-3ea09aa8e89c?w=400',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock Dashboard Stats
export interface DashboardStats {
  bestSellingProduct: {
    name: string;
    unitsSold: number;
    change: number;
  };
  inventoryAmount: {
    count: number;
    change: number;
  };
  mostPurchasedDay: {
    day: string;
    unitsSold: number;
    change: number;
  };
  productsOutOfStock: {
    name: string;
    stock: number;
    change: number;
  };
}

const mockStats: DashboardStats = {
  bestSellingProduct: {
    name: 'Sterling Bottle',
    unitsSold: 300,
    change: 36,
  },
  inventoryAmount: {
    count: 500,
    change: 36,
  },
  mostPurchasedDay: {
    day: 'Friday',
    unitsSold: 300,
    change: 36,
  },
  productsOutOfStock: {
    name: 'Toothpaste',
    stock: 0,
    change: 36,
  },
};

// Mock Categories
export interface Category {
  id: string;
  name: string;
  subcategories?: string[];
}

const mockCategories: Category[] = [
  {
    id: 'makeup',
    name: 'Make up',
    subcategories: [
      'Foundations',
      'Concealers & Color Correctors',
      'Powder',
      'Lipstick',
      'Eyeliner & Kajal',
      'Mascara',
    ],
  },
  {
    id: 'fragrances',
    name: 'Fragrances',
    subcategories: ["Women's", "Men's"],
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    subcategories: [
      'Skincare',
      'Sunscreens & Tanning Products',
      'Contraceptives & Lubricants',
      'Piercing & Tatoos Supplies',
      'Deodorants & Antiperspirants',
      'Lip Care',
    ],
  },
  {
    id: 'oral-care',
    name: 'Oral Care',
    subcategories: ['Teeth Whitening', 'Toothpaste', 'Toothbrush'],
  },
];

// Mock Service Appointments
export interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  customerName: string;
  customerAvatar: string;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    date: '2026-03-02',
    time: '10:00 am - 11:00 am',
    service: 'Hair',
    customerName: 'Sarah Johnson',
    customerAvatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    date: '2026-03-04',
    time: '10:00 am - 11:00 am',
    service: 'Make Up',
    customerName: 'Emily Davis',
    customerAvatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '3',
    date: '2026-03-06',
    time: '10:00 am - 11:00 am',
    service: 'Nails',
    customerName: 'Jessica Wilson',
    customerAvatar: 'https://i.pravatar.cc/150?img=9',
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

// Mock API Functions
export const mockApi = {
  // Dashboard Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(500);
    return mockStats;
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    await delay(300);
    return mockProducts;
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    await delay(200);
    return mockCategories;
  },

  // Service Appointments
  getAppointments: async (): Promise<Appointment[]> => {
    await delay(400);
    return mockAppointments;
  },

  // Service Stats
  getServiceStats: async (): Promise<ServiceStats> => {
    await delay(500);
    return mockServiceStats;
  },
};