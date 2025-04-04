import axios from "axios";
import { useNavigate } from "react-router-dom";
import qs from "qs";

const API_SERVER_URL = "http://localhost:8085";
const AUTH_SERVER_URL = `${API_SERVER_URL}/oauth2/authorize`;
const TOKEN_URL = `${API_SERVER_URL}/oauth2/token`;
const CLIENT_ID = "client";
const CLIENT_SECRET = "secret";
const REDIRECT_URI = "http://localhost:3000/auth-callback";

const authService = {
    login: () => {
        const redirectUri = encodeURIComponent(`${REDIRECT_URI}`);
        const scope = 'openid profile';
        const authUrl = `${AUTH_SERVER_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`;

        window.location.href = authUrl;
    },

    logout: async () => {
        try {
            await axios.post(`${API_SERVER_URL}/logout`, {}, { withCredentials: true });
            localStorage.removeItem("jwtToken");
            authService.clearCookies();

            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed", error);
        }
    },

    exchangeCodeForToken: async (authCode: string) => {
        try {
            const body = qs.stringify({
                grant_type: "authorization_code",
                code: authCode,
                client_id: CLIENT_ID,
                redirect_uri: REDIRECT_URI
            });

            const response = await axios.post(TOKEN_URL, body, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
                },
                withCredentials: true
            });

            localStorage.setItem("jwtToken", response.data.access_token);
            return response.data;
        } catch (error) {
            console.error("Token exchange failed", error);
            throw error;
        }
    },

    getToken: () => localStorage.getItem("jwtToken"),

    clearCookies: () => {
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        })
    }
}

export default authService;
