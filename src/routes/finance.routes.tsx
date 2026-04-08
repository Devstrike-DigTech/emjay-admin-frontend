import { RouteObject } from 'react-router-dom';

// Finance Pages
import FinancePage from '@/features/finance/pages/FinancePage';

export const financeRoutes: RouteObject[] = [
  {
    index: true,
    element: <FinancePage />,
  },
];