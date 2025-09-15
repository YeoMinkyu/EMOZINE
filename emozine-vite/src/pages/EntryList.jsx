import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { readServerError, handleError401 } from "../utils/api"
import EmptyState from "./EmptyState";

const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

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
        <div className="min-h-screen flex items-center justify-center px-4">
            {entries.length === 0
            ? 
                <EmptyState />
            : 
                <EntryItem
                    setDeletedId={setDeletedId}
                    handleDelete={handleDelete}
                    entries={entries}
                    deletedId={deletedId}
                    deleting={deleting}
                />}
        </div>
    )
}

function EntryItem(
    {
        entries,
        setDeletedId,
        handleDelete,
        deletedId,
        deleting,
    } ) {
    return (
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="space-y-4 text-white">
            {entries.map(entry => (
                <li 
                    key={entry.id}
                    tabIndex={0}
                    aria-label={`Entry from ${formatDate(entry.created_at)}: ${entry.content}`}
                    role="article"
                >
                    <div className="rounded-md p-4 space-y-4 bg-gray-600 hover:bg-gray-400 shadow-md">
                        <div>
                            <div>
                                <p> {entry.content?.trim() ? entry.content : "No Content"} </p>
                                <strong>{entry.emoji}</strong>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <small>{formatDate(entry.created_at)}</small>
                            <div className="space-x-2">
                                <Link
                                    className="button-primary"
                                    to={`/entries/${entry.id}/edit`}
                                    aria-label={`Edit entry from ${formatDate(entry.created_at)}`}
                                >
                                    Edit
                                </Link>
                                <button 
                                    className="button-primary"
                                    onClick={() => {
                                    setDeletedId(entry.id);
                                    }}
                                    aria-label={`Delete entry from ${formatDate(entry.created_at)}`}
                                >
                                    Delete
                                </button>
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
                            </div>
                        </div>
                    </div>
                </li>
            ))}
            </ul>
        </div>
    );
    
}

export default EntryList