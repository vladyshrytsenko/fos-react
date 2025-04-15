import axios from "axios";
import { environment } from "../environments/environment";
import { Dessert } from "../models/dessert";

const BASE_URL = `${environment.gatewayUrl}/api/core/desserts`;

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

const dessertService = {
    getById: (id: number): Promise<Dessert> => 
        instance.get<Dessert>(`/${id}`).then(res => res.data),

    getByName: (name: string): Promise<Dessert> =>
        instance.get<Dessert>(`/searchBy?name=${name}`).then(res => res.data),

    findAll: (): Promise<Dessert[]> => 
        instance.get<{content: Dessert[]}>("").then(res => res.data.content),

    create: (dessert: Dessert): Promise<Dessert> => 
        instance.post<Dessert>("", dessert).then(res => res.data),

    updateById: (id: number, dessert: Dessert): Promise<Dessert> => 
        instance.put<Dessert>(`/${id}`, dessert).then(res => res.data),
    
    deleteById: (id: number): Promise<void> => 
        instance.delete<void>(`/${id}`).then(res => res.data),

    deleteAllByIds: (ids: number[]): Promise<void> =>
        instance.delete<void>('/delete', { data: ids }).then(res => res.data)      
};

export default dessertService;
