import { environment } from "../environments/environment";
import axiosInstance from "./axiosInstance";

const BASE_URL = `${environment.gatewayUrl}/api/core/reports`;

const reportService = {
    generateReport: (): Promise<Blob> => 
        axiosInstance.post<Blob>(BASE_URL)
            .then(res => res.data)
};

export default reportService;
