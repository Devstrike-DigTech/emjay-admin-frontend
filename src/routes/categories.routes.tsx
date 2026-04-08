import { RouteObject } from 'react-router-dom';
import CategoriesPage from '@/features/categories/pages/CategoriesPage';

export const categoriesRoutes: RouteObject[] = [{ path: 'categories', element: <CategoriesPage /> }];
