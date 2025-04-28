import { Role } from "./user";

export interface ChatSupport {
    id: string;
    customerId: number;
    agentId: number;
    status: ChatSupportStatus;
    subject: string;
    messages: Message[];
    createdAt?: Date;
    updatedAt?: Date;
    closedAt?: Date;
    isDeleted?: boolean;
    deletedAt?: Date | null;
}

export interface Message {
    chatId?: String;
    senderId?: number;
    senderName?: string;
    senderRole?: Role;
    content: string;
    status?: MessageStatus;
    attachments: string[];
    createdAt?: Date;
}

export interface Topic {
    subject: string;
    message: Message;
}

export enum ChatSupportStatus {
    Open = 'OPEN',
    Assigned = 'ASSIGNED',
    Closed = 'CLOSED'
}

export enum MessageStatus {
    Received = 'RECEIVED',
    Delivered = 'DELIVERED',
    Read = 'READ'
}
