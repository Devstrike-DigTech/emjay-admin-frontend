import { RouteObject, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '@/shared/components/layout/DashboardLayout';

// Auth Pages
import LoginPage from '@/features/auth/pages/LoginPage';

// Route modules
import { dashboardRoutes } from './dashboard.routes';
import { analyticsRoutes } from './analytics.routes';

// Protected Route Component
import { ProtectedRoute } from '@/shared/components/layout/ProtectedRoute';
import { productRoutes } from './products.routes';
import { adsPromoRoutes } from './ads-promo.routes';
import { financeRoutes } from './finance.routes';
import { contactRoutes } from './contact.routes';
import { conversationsRoutes } from './conversations.routes';
import { categoriesRoutes } from './categories.routes';
import { suppliersRoutes } from './suppliers.routes';

export const routes: RouteObject[] = [
  // Public Routes
  {
    path: '/login',
    element: <LoginPage />,
  },

  // Protected Routes
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // Dashboard routes
      ...dashboardRoutes,

      // Analytics routes
      {
        path: 'analytics',
        children: analyticsRoutes,
      },

      // Product routes
      {
        path: 'products',
        children: productRoutes,
      },

      // Categories routes
      ...categoriesRoutes,

      // Suppliers routes
      ...suppliersRoutes,

      // Ads & Promo routes
      {
        path: 'ads-promo',
        children: adsPromoRoutes,
      },

      // Finance routes
      {
        path: 'finance',
        children: financeRoutes,
      },

      // Contact Us routes
      {
        path: 'contact-us',
        children: contactRoutes,
      },

      // Conversations routes
      {
        path: 'conversations',
        children: conversationsRoutes,
      },
    ],
  },

  // Catch all - redirect to home
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
