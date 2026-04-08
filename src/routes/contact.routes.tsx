import { RouteObject } from 'react-router-dom';

// Contact Pages
import ContactUsPage from '@/features/contact-us/pages/ContactUsPage';

export const contactRoutes: RouteObject[] = [
  {
    index: true,
    element: <ContactUsPage />,
  },
];