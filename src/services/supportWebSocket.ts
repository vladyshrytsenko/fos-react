import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import { environment } from "../environments/environment";
import { Role } from "../models/user";
import { Message, MessageStatus } from "../models/chat-support";

const socketUrl = `${environment.gatewayUrl}/ws`;

let client: Client;
let currentSubscription: StompSubscription | null = null;

// Client init
export function connectWebSocket(chatId: string, onMessage: (msg: any) => void) {
    client = new Client({
        webSocketFactory: () => new SockJS(socketUrl),
        reconnectDelay: 5000,
        onConnect: () => {
            subscribeToChat(chatId, onMessage);

            console.log('✅ Connected to WebSocket and subscribed to the chat');
        },
        onStompError: (frame) => {
            console.error('Broker error:', frame.headers['message']);
            console.error('Details:', frame.body);
        }
    });

    client.activate();
}

// Subscribe on specific chat
export function subscribeToChat(chatId: string, onMessage: (msg: any) => void) {
    if (!client || !client.connected) {
        return;
    }

    if (currentSubscription) {
        currentSubscription.unsubscribe();
    }

    currentSubscription = client.subscribe(`/user/chat/${chatId}`, (messages: IMessage) => {
        const body: Message[] = JSON.parse(messages.body);
        console.log('Received messages:', body);
        onMessage(body);
    });

    client.publish({
        destination: `/app/ws/chat/init`,
        body: JSON.stringify({ chatId })
    });
}

export function sendMessage(message: {
    chatId: string, 
    senderId: number, 
    senderName: string,
    senderRole: Role,
    content: string,
    status: MessageStatus,
    attachments?: any[] }) {

    if (!client || !client.connected) {
        console.warn('WebSocket client not connected');
        return;
    }

    client.publish({
        destination: '/app/ws/chat', // MessageMapping
        body: JSON.stringify(message)
    });
}

export function dissconnectWebSocket() {
    if (client && client.active) {
        client.deactivate();
    }
}
