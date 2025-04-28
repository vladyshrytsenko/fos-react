import { environment } from "../environments/environment";
import { ChatSupport, Message, Topic } from "../models/chat-support";
import axiosInstance from "./axiosInstance";

const BASE_URL = `${environment.gatewayUrl}/api/support/chats`;

const supportService = {

    findAllChatsForCustomer: (customerId: number): Promise<ChatSupport[]> => 
        axiosInstance.get<{content: ChatSupport[]}>(`${BASE_URL}/customer/${customerId}`)
            .then(res => res.data.content),

    findAllChatsHandledByAgent: (agentId: number): Promise<ChatSupport[]> => 
        axiosInstance.get<{content: ChatSupport[]}>(`${BASE_URL}/agent/${agentId}`)
            .then(res => res.data.content),

    create: (topic: Topic): Promise<ChatSupport> => 
        axiosInstance.post<ChatSupport>(BASE_URL, topic)
            .then(res => res.data)

};

export default supportService;