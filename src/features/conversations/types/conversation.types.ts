export type ConversationCategory =
  | 'PRODUCT_REQUEST'
  | 'STAFF_MESSAGE'
  | 'CONTACT_US'
  | 'INVENTORY'
  | 'GENERAL';

export type InitiatorType = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export type SenderType = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export type MessageType = 'TEXT' | 'IMAGE' | 'PRODUCT_LINK' | 'ORDER_LINK';

export interface ConversationSummary {
  id: string;
  category: ConversationCategory;
  subject: string | null;
  initiatorId: string;
  initiatorType: InitiatorType;
  isRead: boolean;
  lastMessageAt: string | null;
  createdAt: string;
}

export interface ConversationResponse extends ConversationSummary {
  messages?: MessageResponse[];
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: SenderType;
  content: string;
  messageType: MessageType;
  sentAt: string;
}

export interface SendMessageRequest {
  content: string;
  messageType: MessageType;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
