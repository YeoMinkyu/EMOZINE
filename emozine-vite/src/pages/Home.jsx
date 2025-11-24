import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "../config/urls";

function Home() {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setErrorMessage("");
        const token = localStorage.getItem("access_token");

        if (!token) return;

        try {
            navigate(ROUTE.DASHBOARD.path);
        } catch (err) {
            setErrorMessage(err?.message ?? "Navigation failed.");
        }
    }, [navigate]);
    
    return (
        <>
            <h1 className="heading-primary">EMOZINE HOMEPAGE 📝</h1>
            {errorMessage && <p className="error-msg" role="alert">{errorMessage}</p>}
        </>
    );
}

export default Home;