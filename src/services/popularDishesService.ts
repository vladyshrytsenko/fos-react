import { environment } from "../environments/environment";
import axiosInstance from "./axiosInstance";

const BASE_URL = `${environment.gatewayUrl}/api/core/popular`;

const popularDishesService = {
    findAll: (): Promise<Map<string, string[]>> => 
        axiosInstance.get<Map<string, string[]>>(BASE_URL)
            .then(res => res.data)
};

export default popularDishesService;
