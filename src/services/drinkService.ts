import axios from "axios";
import { environment } from "../environments/environment";
import { Drink } from "../models/drink";

const BASE_URL = `${environment.gatewayUrl}/api/core/drinks`;

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

const drinkService = {
    getById: (id: number): Promise<Drink> => 
        instance.get<Drink>(`/${id}`).then(res => res.data),

    findAll: (): Promise<Drink[]> => 
        instance.get<{content: Drink[]}>("").then(res => res.data.content),

    create: (drink: Drink): Promise<Drink> => 
        instance.post<Drink>("", drink).then(res => res.data),

    updateById: (id: number, drink: Drink): Promise<Drink> => 
        instance.put<Drink>(`/${id}`, drink).then(res => res.data),
    
    deleteById: (id: number): Promise<void> => 
        instance.delete<void>(`/${id}`).then(res => res.data)
};

export default drinkService;
