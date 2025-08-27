import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { readServerError, handleError401 } from "../utils/api"
import EmptyState from "./EmptyState";

function EntryList () {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true); // loading about fetching the data of entries from the server
    const [deleting, setDeleting] = useState(false); // 
    const [deletedId, setDeletedId] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Define an async function inside the effect
        const fetchEntries = async () => {  
            try {
                setError("");
                const token = localStorage.getItem("access_token");

                if (!token) {
                    navigate('/login');
                    return;
                }

                setLoading(true);

                const response = await fetch("http://127.0.0.1:8000/api/entries/", {
                    headers: {
                        "Authorization": `Bearer ${token}`, 
                    },
                });

                if (handleError401(response, navigate)) {
                    setLoading(false);
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    setEntries(data);    
                } else {
                    const msg = (await readServerError(response)) || `Failed fetching entries (HTTP ${response.status})`;
                    setError(msg);
                }
            } catch(error) {
                setError(error?.message || "Network error while fetching entries");
            } finally {
                setLoading(false); // set loading false when the data is fetched successfully or the process of fetching makes an error from the server
            }
        };

        // Then call the async function
       fetchEntries();
    }, [navigate])

    const handleDelete = async (id) => {
        if (deleting) return;
        setError("");
        const token = localStorage.getItem('access_token'); 

        setDeleting(true);

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/entries/${id}/`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });

            if (handleError401(response, navigate)) {
                setDeleting(false);
                return;
            }

            if(response.ok){
                setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
                setDeletedId(null);
            }
            else {
                const msg = (await readServerError(response)) || `Failed to delete entry (HTTP ${response.status})`;
                setError(msg);
            }

        } catch(error) {
            setError(error?.message || "Network error while deleting entry");
        } finally {
            setDeleting(false);
        }
        
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }} role="alert">{error}</p>; // Error display: inline

    return (
        <div>
            <h2>Your Journal Entries</h2>
            {entries.length === 0
            ? <EmptyState />
            : (
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
                            {deletedId === entry.id && (
                              <Modal
                                isOpen={true}
                                onConfirm={() => handleDelete(deletedId)}
                                onCancel={() => setDeletedId(null)}
                                isDeleting={deleting}
                                id={deletedId}
                              >
                                Are you sure want to delete?
                              </Modal>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default EntryList