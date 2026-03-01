import MostPurchasedDayPage from "@/features/analytics/pages/MostPurchasedDayPage";
import MostPurchasedProductsPage from "@/features/analytics/pages/MostPurchasedProductsPage";
import TotalProductInventoryPage from "@/features/analytics/pages/TotalProductInventoryPage";
import TotalSalesPage from "@/features/analytics/pages/TotalSalesPage";
import { RouteObject } from "react-router-dom";

export const analyticsRoutes: RouteObject[] = [
  { path: 'most-purchased-products', element: <MostPurchasedProductsPage /> },
  { path: 'total-sales', element: <TotalSalesPage /> },

{
  path: 'most-purchased-day',
  element: <MostPurchasedDayPage />
},
{
  path: 'inventory',
  element: <TotalProductInventoryPage />
},

 
  // ... more routes
];