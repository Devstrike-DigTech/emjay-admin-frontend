import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationsApi } from '../api/conversations.api';

export type ConversationsFilter = 'all' | 'unread';

export function useConversations(filter: ConversationsFilter = 'all') {
  return useQuery({
    queryKey: ['conversations', filter],
    queryFn: () =>
      filter === 'unread'
        ? conversationsApi.getUnread()
        : conversationsApi.getAll(),
  });
}

export function useConversation(id: string | null) {
  return useQuery({
    queryKey: ['conversations', id],
    queryFn: () => conversationsApi.getById(id!),
    enabled: !!id,
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['conversations', conversationId, 'messages'],
    queryFn: () => conversationsApi.getMessages(conversationId!),
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      conversationsApi.sendMessage(conversationId, content),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['conversations', variables.conversationId, 'messages'],
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => conversationsApi.markAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
