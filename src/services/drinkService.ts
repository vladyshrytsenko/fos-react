import { environment } from "../environments/environment";
import { Drink } from "../models/drink";
import axiosInstance from "./axiosInstance";

const BASE_URL = `${environment.gatewayUrl}/api/core/drinks`;

const drinkService = {
    getById: (id: number): Promise<Drink> => 
        axiosInstance.get<Drink>(`${BASE_URL}/${id}`)
            .then(res => res.data),

    findAll: (): Promise<Drink[]> => 
        axiosInstance.get<{content: Drink[]}>(BASE_URL)
            .then(res => res.data.content),

    create: (drink: Drink): Promise<Drink> => 
        axiosInstance.post<Drink>(BASE_URL, drink)
            .then(res => res.data),

    updateById: (id: number, drink: Drink): Promise<Drink> => 
        axiosInstance.put<Drink>(`${BASE_URL}/${id}`, drink)
            .then(res => res.data),
    
    deleteById: (id: number): Promise<void> => 
        axiosInstance.delete<void>(`${BASE_URL}/${id}`)
            .then(res => res.data),

    deleteAllByIds: (ids: number[]): Promise<void> => 
        axiosInstance.delete<void>(`${BASE_URL}/delete`, { data: ids })
            .then(res => res.data)
};

export default drinkService;
