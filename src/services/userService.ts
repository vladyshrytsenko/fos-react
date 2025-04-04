import axios from "axios";
import { environment } from "../environments/environment";
import { User } from "../models/user";

const BASE_URL = `${environment.gatewayUrl}/api/auth/users`;

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

const userService = {
    getById: (id: number): Promise<User> => 
        instance.get<User>(`/${id}`).then(res => res.data),

    getByUsername: (username: string): Promise<User> =>
        instance.get<User>(`/username/${username}`).then(res => res.data),

    getByEmail: (email: string): Promise<User> =>
        instance.get<User>(`/email/${email}`).then(res => res.data),

    getByRole: (role: string): Promise<User> =>
        instance.get<User>(`/role/${role}`).then(res => res.data),

    getCurrentUser: (): Promise<User> =>
        instance.get<User>("/current-user").then(res => res.data),

    findAll: (): Promise<User[]> => 
        instance.get<{content: User[]}>("").then(res => res.data.content),

    register: (user: User): Promise<any> =>
        instance.post<any>("/auth/register", user).then(res => res.data),

    updateById: (id: number, user: User): Promise<User> => 
        instance.put<User>(`/${id}`, user).then(res => res.data),
    
    deleteById: (id: number): Promise<void> => 
        instance.delete<void>(`/${id}`).then(res => res.data),

    isAdmin(): boolean {
        const token = getToken();
      
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
