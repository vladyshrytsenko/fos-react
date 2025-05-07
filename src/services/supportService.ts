import { environment } from "../environments/environment";
import { ChatSupport, Message, Topic } from "../models/chat-support";
import axiosInstance from "./axiosInstance";

const BASE_URL = `${environment.gatewayUrl}/api/support/chats`;

const supportService = {

    findAllChatsForCustomer: (page: number = 0, size: number = 10): Promise<any> => 
        axiosInstance.get<any>(`${BASE_URL}/customer`, { params: { page, size, sort: 'id,desc' }})
            .then(res => res.data),

    findAllChatsHandledByAgent: (page: number = 0, size: number = 10): Promise<any> => 
        axiosInstance.get<any>(`${BASE_URL}/agent`, { params: { page, size, sort: 'id,desc' }})
            .then(res => res.data),

    create: (topic: Topic): Promise<ChatSupport> => 
        axiosInstance.post<ChatSupport>(BASE_URL, topic)
            .then(res => res.data)

};

export default supportService;
