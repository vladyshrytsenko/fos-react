import { environment } from "../environments/environment";
import { User } from "../models/user";
import axiosInstance from "./axiosInstance";
import storageService from "./storageService";

const BASE_URL = `${environment.gatewayUrl}/api/auth/users`;

const userService = {
    getById: (id: number): Promise<User> => 
        axiosInstance.get<User>(`${BASE_URL}/${id}`)
            .then(res => res.data),

    getByUsername: (username: string): Promise<User> =>
        axiosInstance.get<User>(`${BASE_URL}/username/${username}`)
            .then(res => res.data),

    getByEmail: (email: string): Promise<User> =>
        axiosInstance.get<User>(`${BASE_URL}/email/${email}`)
            .then(res => res.data),

    getByRole: (role: string): Promise<User> =>
        axiosInstance.get<User>(`${BASE_URL}/role/${role}`)
            .then(res => res.data),

    getCurrentUser: (): Promise<User> =>
        axiosInstance.get<User>(`${BASE_URL}/current-user`)
            .then(res => res.data),

    findAll: (): Promise<User[]> => 
        axiosInstance.get<{content: User[]}>(BASE_URL)
            .then(res => res.data.content),

    register: (user: User): Promise<any> =>
        axiosInstance.post<any>(`${BASE_URL}/auth/register`, user)
            .then(res => res.data),

    updateById: (id: number, user: User): Promise<User> => 
        axiosInstance.put<User>(`${BASE_URL}/${id}`, user)
            .then(res => res.data),
    
    deleteById: (id: number): Promise<void> => 
        axiosInstance.delete<void>(`${BASE_URL}/${id}`)
            .then(res => res.data),

    isAdmin(): boolean {
        const token = storageService.getJwtToken();
      
        if (token != null) {
            const payload = this.decodeToken(token);
            if (payload || payload.role) {
                if (payload.role === 'ADMIN') {
                    return true;
                }
            }
        }
        return false;
    },

    decodeToken(token: string): any {
        try {
          const payload = token.split('.')[1];
          return JSON.parse(atob(payload));
        } catch (e) {
          console.error('Error decoding token', e);
          return null;
        }
      }
};

export default userService;
