import axios from "axios";
import { environment } from "../environments/environment";
import { Subscription } from "../models/subscription";

const BASE_URL = `${environment.gatewayUrl}/api/core/subscriptions`;

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

const subscriptionService = {
    create: (subscription: Subscription): Promise<Subscription> => 
        instance.post<Subscription>("", subscription).then(res => res.data)
};

export default subscriptionService;
