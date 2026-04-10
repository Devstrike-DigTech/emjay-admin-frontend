import { RouteObject } from 'react-router-dom';
import ProductsPage from '@/features/products/pages/ProductsPage';
import ProductDetailPage from '@/features/products/pages/ProductDetailPage';
import AddProductPage from '@/features/products/pages/AddProductPage';

export const productRoutes: RouteObject[] = [
  { index: true, element: <ProductsPage /> },
  { path: ':id', element: <ProductDetailPage /> },
  { path: 'add', element: <AddProductPage /> },
];