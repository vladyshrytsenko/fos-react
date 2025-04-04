import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import authService from "../services/authService";

export default function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const code = searchParams.get("code");

        if (code) {
            authService.exchangeCodeForToken(code).then(() => {
                navigate("/menu");
            })
                .catch(() => navigate("/login"));
        } else {
            navigate("/login");
        }
    }, [navigate, searchParams]);

    return <p>Processing login...</p>;
}
