import axios from "axios";
import { environment } from "../environments/environment";
import { Cuisine } from "../models/cuisine";

const BASE_URL = `${environment.gatewayUrl}/api/core/cuisines`;

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

const cuisineService = {
    getById: (id: number): Promise<Cuisine> => 
        instance.get<Cuisine>(`/${id}`).then(res => res.data),
    
    findAll: (): Promise<Cuisine[]> => 
        instance.get<{content: Cuisine[]}>("").then(res => res.data.content),

    create: (cuisine: Cuisine): Promise<Cuisine> => 
        instance.post<Cuisine>("", cuisine).then(res => res.data),
    
    updateById: (id: number, cuisine: Cuisine): Promise<Cuisine> => 
        instance.put<Cuisine>(`/${id}`, cuisine).then(res => res.data),
        
    deleteById: (id: number): Promise<void> => 
        instance.delete<void>(`/${id}`).then(res => res.data)
};

export default cuisineService;
