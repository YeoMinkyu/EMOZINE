import React, {useEffect} from "react"
import {useNavigate} from "react-router-dom"

function Dashboard () {
    const navigate = useNavigate();

    console.log("[Debug] Redering...")
    useEffect (() => {
        const token = localStorage.getItem('access_token');

        console.log("[Debug] Effect...")
        if (!token) {
            navigate('/login');
        }

    }, [navigate]);

    return (
        <div>
            <h2>Welcome to Your Journal Dashboard</h2>
        </div>
    );
}

export default Dashboard;