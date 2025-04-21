import { environment } from "../environments/environment";
import { Order } from "../models/order";
import axiosInstance from "./axiosInstance";

const BASE_URL = `${environment.gatewayUrl}/api/core/orders`;

const orderService = {
    getById: (id: number): Promise<Order> => 
        axiosInstance.get<Order>(`${BASE_URL}/${id}`)
            .then(res => res.data),

    findAll: (page: number = 0, size: number = 10): Promise<any> => 
        axiosInstance.get<any>(BASE_URL, { params: { page, size, sort: 'id,desc' }})
            .then(res => res.data),

    create: (order: Order): Promise<Order> => 
        axiosInstance.post<Order>(BASE_URL, order)
            .then(res => res.data),
    
    deleteById: (id: number): Promise<void> => 
        axiosInstance.delete<void>(`${BASE_URL}/${id}`)
            .then(res => res.data)
};

export default orderService;
