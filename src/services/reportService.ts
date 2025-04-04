import axios from "axios";
import { environment } from "../environments/environment";

const BASE_URL = `${environment.gatewayUrl}/api/core/reports`;

const getToken = () => localStorage.getItem("jwtToken");

const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    responseType: 'blob' as 'json'
});

instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const reportService = {
    generateReport: (): Promise<Blob> => 
        instance.post<Blob>("").then(res => res.data)
};

export default reportService;
