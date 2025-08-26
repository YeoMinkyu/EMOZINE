import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { readServerError, handleError401 } from "../utils/api"

function EditEntry() {
    const [content, setContent] = useState("");
    const [emoji, setEmoji] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect (()=> {

        const fetchContent = async () => {
            try{
                const token = localStorage.getItem("access_token");

                setLoading(true);
                
                const response = await fetch(`http://127.0.0.1:8000/api/entries/${id}/`, {
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
                    setContent(data.content);
                    setEmoji(data.emoji);
                } else {
                    const msg = (await readServerError(response)) || `Failed to load the content will be edited (HTTP ${response.status})`
                    setError(msg)
                }
            } catch (error) {
                setError(error?.message || `Network error while loading the content for editing.`);
            } finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, [id, navigate]);

    const handleEditing = async (e) => {
        e.preventDefault();

        if (updating) return;
        setError("");

        if (!content) {
            setError("Empty content cannot update!");
            return;
        }

        setUpdating(true);

        const token = localStorage.getItem("access_token");

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/entries/${id}/`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({content, emoji})
            });

            if (handleError401(response, navigate)) {
                setUpdating(false);
                return;
            }

            if (response.ok) {
                navigate('/entries');
            } else {
                const msg = (await readServerError(response)) || `Failed editing (HTTP ${response.status})`;
                setError(msg);
            }
        } catch(error) {
            setError(error?.message || `Network error editing content.`);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <form onSubmit={handleEditing}>
            <textarea
                disabled={loading || updating}
                rows="6"
                value={content}
                onChange={(e)=> setContent(e.target.value)}
            />
            <br />
            <select value={emoji} onChange={(e)=>setEmoji(e.target.value)} disabled={loading || updating}>
                <option value="">😐 None</option>
                <option value="😊">😊 Happy</option>
                <option value="😢">😢 Sad</option>
                <option value="😡">😡 Angry</option>
                <option value="😌">😌 Calm</option>
            </select>
            <button
                disabled={loading || updating}
                type="submit"
            >
                {updating ? `Updating...` : `Update`}
            </button>
            <button
                disabled={loading || updating} 
                type="button"
                onClick={() => navigate('/entries')}
            >
                Cancel
            </button>
            {error && <p role="alert" style={{color:"red"}}>{error}</p>}
        </form>
    );
}

export default EditEntry;