import axios from "axios";
import { environment } from "../environments/environment";

const BASE_URL = `${environment.gatewayUrl}/api/core/popular`;

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

const popularDishesService = {
    findAll: (): Promise<Map<string, string[]>> => 
        instance.get<Map<string, string[]>>("").then(res => res.data)
};

export default popularDishesService;
