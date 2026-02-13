import { useEffect } from "react";  
import { useNavigate } from "react-router-dom";

export function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("token");
        sessionStorage.clear();

        navigate("/login", { replace: true });
    }, [navigate]);

    return null; 
}