import { environment } from "../environments/environment";
import { Meal } from "../models/meal";
import axiosInstance from "./axiosInstance";

const BASE_URL = `${environment.gatewayUrl}/api/core/meals`;

const mealService = {
    getById: (id: number): Promise<Meal> => 
        axiosInstance.get<Meal>(`${BASE_URL}/${id}`)
            .then(res => res.data),

    getByName: (name: string): Promise<Meal> =>
        axiosInstance.get<Meal>(`${BASE_URL}/searchBy?name=${name}`)
            .then(res => res.data),

    findAll: (): Promise<Meal[]> => 
        axiosInstance.get<{content: Meal[]}>(BASE_URL)
            .then(res => res.data.content),

    create: (meal: Meal): Promise<Meal> => 
        axiosInstance.post<Meal>(BASE_URL, meal)
            .then(res => res.data),

    updateById: (id: number, meal: Meal): Promise<Meal> => 
        axiosInstance.put<Meal>(`${BASE_URL}/${id}`, meal)
            .then(res => res.data),
    
    deleteById: (id: number): Promise<void> => 
        axiosInstance.delete<void>(`${BASE_URL}/${id}`)
            .then(res => res.data),

    deleteAllByIds: (ids: number[]): Promise<void> => 
        axiosInstance.delete<void>(`${BASE_URL}/delete`, { data: ids })
            .then(res => res.data)
};

export default mealService;
