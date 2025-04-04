import axios from "axios";
import { environment } from "../environments/environment";
import { Meal } from "../models/meal";

const BASE_URL = `${environment.gatewayUrl}/api/core/meals`;

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

const mealService = {
    getById: (id: number): Promise<Meal> => 
        instance.get<Meal>(`/${id}`).then(res => res.data),

    getByName: (name: string): Promise<Meal> =>
        instance.get<Meal>(`/searchBy?name=${name}`).then(res => res.data),

    findAll: (): Promise<Meal[]> => 
        instance.get<{content: Meal[]}>("").then(res => res.data.content),

    create: (meal: Meal): Promise<Meal> => 
        instance.post<Meal>("", meal).then(res => res.data),

    updateById: (id: number, meal: Meal): Promise<Meal> => 
        instance.put<Meal>(`/${id}`, meal).then(res => res.data),
    
    deleteById: (id: number): Promise<void> => 
        instance.delete<void>(`/${id}`).then(res => res.data)
};

export default mealService;
