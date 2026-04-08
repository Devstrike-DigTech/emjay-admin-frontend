import { RouteObject } from 'react-router-dom';

// Conversations Pages
import ConversationsPage from '@/features/conversations/pages/ConversationsPage';

export const conversationsRoutes: RouteObject[] = [
  {
    index: true,
    element: <ConversationsPage />,
  },
];