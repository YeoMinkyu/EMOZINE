import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";

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

                if (response.status === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    
                    navigate("/login");
                    return;
                }

                const data = await response.json();
                setEntries(data);

            } catch(error) {
                setError("Error listing entry");
            } finally {
                setLoading(false); // set loading false when the data is fetched successfully or the process of fetching makes an error from the server
            }
        };

        // Then call the async function
       fetchEntries();
    }, [navigate])

    const handleDelete = async (id) => {
        if (deleting) return;
        const token = localStorage.getItem('access_token'); 

        setDeleting(true);

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
            }  // TODO: 401 behavior
            else {
                setError("Faild deleting a entry");
            }

        } catch(err) {
            setError(err || "Failed deleting a entry");
        } finally {
            setDeleting(false);
        }
        
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>; // Error display: inline

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
                                <Modal isOpen={true} onConfirm={()=> handleDelete(deletedId)} onCancel={()=> setDeletedId(null)} isDeleting={deleting} id={deletedId}>
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