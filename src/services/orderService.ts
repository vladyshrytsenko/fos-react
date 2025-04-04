import axios from "axios";
import { environment } from "../environments/environment";
import { Order } from "../models/order";

const BASE_URL = `${environment.gatewayUrl}/api/core/orders`;

const getToken = () => localStorage.getItem("jwtToken");

const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const orderService = {
    getById: (id: number): Promise<Order> => 
        instance.get<Order>(`/${id}`).then(res => res.data),

    findAll: (): Promise<Order[]> => 
        instance.get<Order[]>("").then(res => res.data),

    create: (order: Order): Promise<Order> => 
        instance.post<Order>("", order).then(res => res.data),
    
    deleteById: (id: number): Promise<void> => 
        instance.delete<void>(`/${id}`).then(res => res.data)
};

export default orderService;
