import { RouteObject } from 'react-router-dom';
import ProductDetailPage from '@/features/products/pages/ProductDetailPage';
import AddProductPage from '@/features/products/pages/AddProductPage';

export const productRoutes: RouteObject[] = [
  { path: ':id', element: <ProductDetailPage /> },
  { path: 'add', element: <AddProductPage /> },
];