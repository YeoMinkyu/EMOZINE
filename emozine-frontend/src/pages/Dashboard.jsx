import React, {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import EntryList from "./EntryList";

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
            <h2>Journal Dashboard</h2>
            <EntryList></EntryList>
        </div>
    );
}

export default Dashboard;