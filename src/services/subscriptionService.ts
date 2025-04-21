import { environment } from "../environments/environment";
import { Subscription } from "../models/subscription";
import axiosInstance from "./axiosInstance";

const BASE_URL = `${environment.gatewayUrl}/api/core/subscriptions`;

const subscriptionService = {
    create: (subscription: Subscription): Promise<Subscription> => 
        axiosInstance.post<Subscription>(BASE_URL, subscription)
            .then(res => res.data)
};

export default subscriptionService;
