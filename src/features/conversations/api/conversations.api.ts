import { apiClient } from '@/shared/lib/api-client';
import {
  ConversationSummary,
  ConversationResponse,
  MessageResponse,
  SendMessageRequest,
  PageResponse,
} from '../types/conversation.types';

export const conversationsApi = {
  getAll: (page = 0, size = 50) =>
    apiClient.get<PageResponse<ConversationSummary>>('/conversations', {
      params: { page, size },
    }),

  getUnread: () =>
    apiClient.get<PageResponse<ConversationSummary>>('/conversations/unread'),

  getById: (id: string) =>
    apiClient.get<ConversationResponse>(`/conversations/${id}`),

  getMessages: (id: string, page = 0, size = 50) =>
    apiClient.get<PageResponse<MessageResponse>>(`/conversations/${id}/messages`, {
      params: { page, size },
    }),

  sendMessage: (id: string, content: string) =>
    apiClient.post<MessageResponse>(`/conversations/${id}/messages`, {
      content,
      messageType: 'TEXT',
    } satisfies SendMessageRequest),

  markAsRead: (id: string) =>
    apiClient.patch<void>(`/conversations/${id}/read`),
};
