import React, {useEffect} from "react"
import {useNavigate} from "react-router-dom"

function Dashboard () {
    const navigate = useNavigate();

    useEffect (() => {
        const token = localStorage.getItem('access_token');

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