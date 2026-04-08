import { useState, useMemo } from 'react';
import { Search, Mail, Phone, Send } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkAsRead,
} from '../hooks/useConversations';
import { ConversationSummary, ConversationCategory } from '../types/conversation.types';

type ConversationType =
  | 'all'
  | 'unread'
  | 'product-request'
  | 'staff-messages'
  | 'contact-us'
  | 'inventory';

// Maps a backend category to display initials and Tailwind color class
function getCategoryDisplay(category: ConversationCategory): { initials: string; color: string } {
  switch (category) {
    case 'PRODUCT_REQUEST':
      return { initials: 'PR', color: 'bg-gray-400' };
    case 'STAFF_MESSAGE':
      return { initials: 'SM', color: 'bg-blue-500' };
    case 'CONTACT_US':
      return { initials: 'CU', color: 'bg-primary' };
    case 'INVENTORY':
      return { initials: 'IN', color: 'bg-red-600' };
    case 'GENERAL':
      return { initials: 'GE', color: 'bg-green-500' };
    default:
      return { initials: 'GE', color: 'bg-green-500' };
  }
}

// Maps backend category to the ConversationType filter value for frontend filtering
function categoryToFilter(category: ConversationCategory): string {
  switch (category) {
    case 'PRODUCT_REQUEST':
      return 'product-request';
    case 'STAFF_MESSAGE':
      return 'staff-messages';
    case 'CONTACT_US':
      return 'contact-us';
    case 'INVENTORY':
      return 'inventory';
    default:
      return 'all';
  }
}

// Formats an ISO datetime string as relative time (e.g. "2h ago", "3d ago")
function formatRelativeTime(isoString: string | null): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return 'just now';
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Formats an ISO datetime string as a readable date+time string
function formatMessageTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function ConversationsPage() {
  const [activeFilter, setActiveFilter] = useState<ConversationType>('all');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'product-request', label: 'Product Request' },
    { value: 'staff-messages', label: 'Staff Messages' },
    { value: 'contact-us', label: 'Contact Us' },
    { value: 'inventory', label: 'Inventory' },
  ];

  // For 'unread' we hit the dedicated endpoint; for everything else we load all and filter client-side
  const apiFilter = activeFilter === 'unread' ? 'unread' : 'all';
  const { data: conversationsPage, isLoading: isLoadingConversations } = useConversations(apiFilter);

  const allConversations: ConversationSummary[] = conversationsPage?.content ?? [];

  // Frontend category filtering (only applies when not using 'unread' endpoint)
  const displayedConversations = useMemo(() => {
    if (activeFilter === 'all' || activeFilter === 'unread') {
      return allConversations;
    }
    return allConversations.filter(
      (conv) => categoryToFilter(conv.category) === activeFilter
    );
  }, [allConversations, activeFilter]);

  const { data: messagesPage, isLoading: isLoadingMessages } = useMessages(selectedConversationId);
  const messages = messagesPage?.content ?? [];

  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();

  const selectedConv = displayedConversations.find((c) => c.id === selectedConversationId)
    ?? allConversations.find((c) => c.id === selectedConversationId)
    ?? null;

  function handleSelectConversation(conv: ConversationSummary) {
    setSelectedConversationId(conv.id);
    if (!conv.isRead) {
      markAsRead.mutate(conv.id);
    }
  }

  function handleSendMessage() {
    const trimmed = messageText.trim();
    if (!trimmed || !selectedConversationId) return;
    sendMessage.mutate(
      { conversationId: selectedConversationId, content: trimmed },
      { onSuccess: () => setMessageText('') }
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Hey Emjay 👋 here's what's happing on your store today
        </h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 bg-white border-r flex flex-col">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search in Chats"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value as ConversationType)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                    activeFilter === filter.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Items */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingConversations ? (
              <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
                Loading conversations...
              </div>
            ) : displayedConversations.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
                No conversations yet
              </div>
            ) : (
              displayedConversations.map((conv) => {
                const { initials, color } = getCategoryDisplay(conv.category);
                const title = conv.subject ?? conv.category.replace('_', ' ');
                const timeDisplay = formatRelativeTime(conv.lastMessageAt ?? conv.createdAt);

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={cn(
                      'p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors',
                      selectedConversationId === conv.id && 'bg-gray-50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0',
                          color
                        )}
                      >
                        {initials}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {title}
                          </h4>
                          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                            <span className="text-xs text-gray-400">{timeDisplay}</span>
                            {!conv.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {conv.category.replace(/_/g, ' ')}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Mail className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Phone className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedConv.subject ?? selectedConv.category.replace(/_/g, ' ')}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedConv.lastMessageAt
                      ? formatMessageTime(selectedConv.lastMessageAt)
                      : formatMessageTime(selectedConv.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-gray-400 italic text-xs">N/A</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Phone className="w-4 h-4" />
                      <span className="text-gray-400 italic text-xs">N/A</span>
                    </div>
                  </div>

                  {(() => {
                    const { initials, color } = getCategoryDisplay(selectedConv.category);
                    return (
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold',
                          color
                        )}
                      >
                        {initials}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
                    No messages in this conversation yet
                  </div>
                ) : (
                  messages.map((message) => {
                    const isAdmin = message.senderType === 'ADMIN';
                    return (
                      <div
                        key={message.id}
                        className={cn('flex gap-3', isAdmin && 'justify-end')}
                      >
                        {!isAdmin && (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold">
                              {message.senderType.charAt(0)}
                            </span>
                          </div>
                        )}

                        <div className={cn('max-w-2xl')}>
                          <p className="text-xs text-gray-600 mb-2">
                            {formatMessageTime(message.sentAt)}
                          </p>

                          <div
                            className={cn(
                              'rounded-lg p-4',
                              !isAdmin
                                ? 'bg-gray-100 text-gray-900'
                                : 'bg-primary text-white'
                            )}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                        </div>

                        {isAdmin && (
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm">A</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Type Message"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={sendMessage.isPending}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sendMessage.isPending || !messageText.trim()}
                    className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
