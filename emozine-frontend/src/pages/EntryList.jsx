import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EntryList () {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Define an async function inside the effect
        const fetchEntries = async () => {  
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch("http://127.0.0.1:8000/api/entries/", {
                    headers: {
                        "Authorization": `Bearer ${token}`, 
                    },
                });

                if (response.status === 401) {
                    navigate("/login");
                    return;
                }

                const data = await response.json();
                setEntries(data);
                setLoading(false);

            } catch(error) {
                setError("Error listing entry");
                setLoading(false);
            }
        };

        // Then call the async function
       fetchEntries();
    }, [navigate])

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Your Journal Entries</h2>
            {entries.length == 0 ? (<p>
                No entreis yet.
            </p>) : (
                <ul>
                    {entries.map(entry => (
                        <li key={entry.id}>
                            <strong>{entry.emoji}</strong> {entry.content}
                            <br />
                            <small>{entry.created_at.slice(0, 10)}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default EntryList