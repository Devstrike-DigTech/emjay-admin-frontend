import { RouteObject } from 'react-router-dom';

// Ads & Promo Pages
import AdsPromoPage from '@/features/ads-promo/pages/AdsPromoPage';
import CreateAdPage from '@/features/ads-promo/pages/CreateAdPage';
import AdDetailPage from '@/features/ads-promo/pages/AdDetailPage';
import CreatePromoPage from '@/features/ads-promo/pages/CreatePromoPage';
import CreateBundlePage from '@/features/ads-promo/pages/CreateBundlePage';

export const adsPromoRoutes: RouteObject[] = [
  {
    index: true,
    element: <AdsPromoPage />,
  },
  {
    path: 'create-ad',
    element: <CreateAdPage />,
  },
  {
    path: 'ad/:id',
    element: <AdDetailPage />,
  },
  {
    path: 'create-promo',
    element: <CreatePromoPage />,
  },
   {
    path: 'create-bundle',
    element: <CreateBundlePage />,
  },
  // TODO: Add remaining detail pages
  // {
  //   path: 'promo/:id',
  //   element: <PromoDetailPage />,
  // },
  // {
  //   path: 'bundle/:id',
  //   element: <BundleDetailPage />,
  // },
  // {
  //   path: 'create-bundle',
  //   element: <CreateBundlePage />,
  // },
];