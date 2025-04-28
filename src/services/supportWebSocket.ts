import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from 'sockjs-client';

const socketUrl = 'http://localhost:8095/ws';

let client: Client;
let currentSubscription: StompSubscription | null = null;

// Client init
export function connectWebSocket(onMessage: (msg: any) => void) {
    client = new Client({
        webSocketFactory: () => new SockJS(socketUrl),
        reconnectDelay: 5000,
        onConnect: () => {
            console.log('Connected to WebSocket');
            // subscribeToChat('');
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
        console.warn('WebSocket client not connected');
        return;
    }

    if (currentSubscription) {
        currentSubscription.unsubscribe();
    }

    currentSubscription = client.subscribe(`/user/chat/${chatId}`, (message: IMessage) => {
        const body = JSON.parse(message.body);
        console.log('Received message:', body);
        onMessage(body);
    });
}

export function sendMessage(message: {
    chatId: string, 
    senderId: number, 
    content: string,
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
        console.log('WebSocket disconnected');
    }
}
