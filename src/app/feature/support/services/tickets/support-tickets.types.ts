/**
 * Support ticket category enum
 */
export enum TicketCategory {
  ACCOUNT_ISSUE = 'ACCOUNT_ISSUE',
  BILLING_PAYMENT = 'BILLING_PAYMENT',
  TECHNICAL_PROBLEM = 'TECHNICAL_PROBLEM',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
  PARTNERSHIP_ISSUE = 'PARTNERSHIP_ISSUE',
  CONTENT_MODERATION = 'CONTENT_MODERATION',
  GENERAL_INQUIRY = 'GENERAL_INQUIRY'
}

/**
 * Support ticket status enum
 */
export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_FOR_CUSTOMER = 'WAITING_FOR_CUSTOMER',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

/**
 * Create ticket request DTO
 */
export interface SupportTicketDtoIn {
  contactEmail: string;
  subject: string;
  description: string;
  category: TicketCategory;
}

/**
 * Ticket response request DTO
 */
export interface TicketResponseDtoIn {
  content: string;
}

/**
 * Admin ticket response DTO with additional fields
 */
export interface AdminTicketResponseDtoIn extends TicketResponseDtoIn {
  newStatus?: TicketStatus;
  adminName?: string;
  sendEmail: boolean;
}

/**
 * Ticket attachment DTO
 */
export interface TicketAttachmentDtoIn {
  fileName: string;
  contentType: string;
  fileUrl: string;
  fileSize: number;
}

/**
 * Response attachment DTO - same structure as ticket attachment
 */
export type ResponseAttachmentDtoIn = TicketAttachmentDtoIn;

/**
 * Full ticket response from API
 */
export interface SupportTicketDtoOut {
  id: number;
  contactEmail: string;
  subject: string;
  description: string;
  status: TicketStatus;
  statusDisplay: string;
  category: TicketCategory;
  categoryDisplay: string;
  ticketReference: string;
  adminAssignee: string;
  createdTime: string;
  lastUpdateTime: string;
  resolvedTime: string;
  responses: TicketResponseDtoOut[];
  attachments: TicketAttachmentDtoOut[];
  resolved: boolean;
}

/**
 * Ticket response output DTO
 */
export interface TicketResponseDtoOut {
  id: number;
  ticketId: number;
  content: string;
  fromAdmin: boolean;
  adminName: string;
  createdTime: string;
  attachments: ResponseAttachmentDtoOut[];
}

/**
 * Ticket attachment output DTO
 */
export interface TicketAttachmentDtoOut {
  id: number;
  ticketId: number;
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadTime: string;
  downloadUrl: string;
}

/**
 * Response attachment output DTO
 */
export interface ResponseAttachmentDtoOut {
  id: number;
  responseId: number;
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadTime: string;
  downloadUrl: string;
}

/**
 * Ticket list filter params
 */
export interface TicketListFilter {
  status?: TicketStatus;
  category?: TicketCategory;
  searchQuery?: string;
  page: number;
  size: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

/**
 * Type alias for paginated ticket response
 */
export type PaginatedTicketResponse = PaginatedResponse<SupportTicketDtoOut>;
