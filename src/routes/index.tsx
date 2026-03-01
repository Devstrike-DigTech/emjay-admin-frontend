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
{
        path: 'products',
        children: productRoutes,
      },
      // Add more route modules here as you build them
      // Example:
      
      // {
      //   path: 'services',
      //   children: serviceRoutes,
      // },
      // {
      //   path: 'staff',
      //   children: staffRoutes,
      // },
    ],
  },

  // Catch all - redirect to home
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];