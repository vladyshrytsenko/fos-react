import { environment } from "../environments/environment";
import { Cuisine } from "../models/cuisine";
import axiosInstance from "./axiosInstance";

const BASE_URL = `${environment.gatewayUrl}/api/core/cuisines`;

const cuisineService = {
    getById: (id: number): Promise<Cuisine> => 
        axiosInstance.get<Cuisine>(`${BASE_URL}/${id}`)
            .then(res => res.data),
    
    findAll: (): Promise<Cuisine[]> => 
        axiosInstance.get<{content: Cuisine[]}>(BASE_URL)
            .then(res => res.data.content),

    create: (cuisine: Cuisine): Promise<Cuisine> => 
        axiosInstance.post<Cuisine>(BASE_URL, cuisine)
            .then(res => res.data),
    
    updateById: (id: number, cuisine: Cuisine): Promise<Cuisine> => 
        axiosInstance.put<Cuisine>(`${BASE_URL}/${id}`, cuisine)
            .then(res => res.data),
        
    deleteById: (id: number): Promise<void> => 
        axiosInstance.delete<void>(`${BASE_URL}/${id}`)
            .then(res => res.data)
};

export default cuisineService;
