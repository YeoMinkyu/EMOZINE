import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";

function EntryList () {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState("");
    const [deletedId, setDeletedId] = useState("")
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
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    
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

    const handleDelete = async (id) => {
        const token = localStorage.getItem('access_token'); 

        console.log("Handle Deleted!");

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/entries/${id}/`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if(response.ok){
                setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
                setDeletedId(null);
            } else {
                setError("Faild deleting a entry");
            }

        } catch(err) {
            setError(err || "Failed deleting a entry");
        }
        
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Your Journal Entries</h2>
            {entries.length === 0 ? (<p>
                No entreis yet.
            </p>) : (
                <ul>
                    {entries.map(entry => (
                        <li key={entry.id}>
                            <strong>{entry.emoji}</strong> {entry.content}
                            <br />
                            <small>{entry.created_at.slice(0, 10)}</small>
                            <br />
                            <Link to={`/entries/${entry.id}/edit`}>Edit</Link>
                            <button onClick={() => {
                                setDeletedId(entry.id);
                            }
                                }>Delete</button>
                            {
                                deletedId === entry.id &&
                                <Modal isOpen={deletedId} onClickedYes={()=> handleDelete(deletedId)} onClickedNo={()=> setDeletedId(null)} id={deletedId}>
                                    Are you sure to delete?
                                </Modal>
                            }
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default EntryList