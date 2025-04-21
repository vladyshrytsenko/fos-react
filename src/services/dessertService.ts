import { environment } from "../environments/environment";
import { Dessert } from "../models/dessert";
import axiosInstance from "./axiosInstance";

const BASE_URL = `${environment.gatewayUrl}/api/core/desserts`;

const dessertService = {
    getById: (id: number): Promise<Dessert> => 
        axiosInstance.get<Dessert>(`${BASE_URL}/${id}`)
            .then(res => res.data),

    getByName: (name: string): Promise<Dessert> =>
        axiosInstance.get<Dessert>(`${BASE_URL}/searchBy?name=${name}`)
            .then(res => res.data),

    findAll: (): Promise<Dessert[]> => 
        axiosInstance.get<{content: Dessert[]}>(BASE_URL)
            .then(res => res.data.content),

    create: (dessert: Dessert): Promise<Dessert> => 
        axiosInstance.post<Dessert>(BASE_URL, dessert)
            .then(res => res.data),

    updateById: (id: number, dessert: Dessert): Promise<Dessert> => 
        axiosInstance.put<Dessert>(`${BASE_URL}/${id}`, dessert)
            .then(res => res.data),
    
    deleteById: (id: number): Promise<void> => 
        axiosInstance.delete<void>(`${BASE_URL}/${id}`)
            .then(res => res.data),

    deleteAllByIds: (ids: number[]): Promise<void> =>
        axiosInstance.delete<void>(`${BASE_URL}/delete`, { data: ids })
            .then(res => res.data)      
};

export default dessertService;
