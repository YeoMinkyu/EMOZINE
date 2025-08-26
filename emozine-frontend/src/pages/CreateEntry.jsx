import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom"

async function readServerError(response) {
    try {
        const body = await response.json();
        if (body?.detail) return body.detail;
        if (body?.error) return body.error;
        if (typeof body === 'string') return body;
        return null;
    } catch {
        return null;
    }
}

function CreateEntry () {
    const [content, setContent] = useState("");
    const [emoji, setEmoji] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if(!token) {
            navigate('/login');
        }

    }, [navigate])

    // handleSubmit with async-await and try catch to POST journal entry to backend('/api/entries/')
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (loading) return;
        
        setError("");
        setLoading(true);

        const token = localStorage.getItem("access_token");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/entries/", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ content, emoji })
            });

            if (response.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                navigate('/login');
                return;
            }

            if(response.ok) {
                navigate('/dashboard');
            } else {
                const serverMsg = await readServerError(response);
                const msg = serverMsg || `Creation failed (HTTP ${response.status})`;
                setError(msg);
            }
        } catch (error) {
            setError(error?.message || `Network error while creating entry.`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="create-entry">
            <h2>Write a New Journal Entry</h2>
            {error && <p role="alert" style={{color: "red"}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <textarea
                    disabled={loading}
                    rows="6"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e)=>setContent(e.target.value)}
                />
                <br />
                <label>Choose an emoji: </label>
                <select 
                    disabled={loading}
                    value={emoji} 
                    onChange={(e) => setEmoji(e.target.value)    
                    }>
                        <option value="">😐 None</option>
                        <option value="😊">😊 Happy</option>
                        <option value="😢">😢 Sad</option>
                        <option value="😡">😡 Angry</option>
                        <option value="😌">😌 Calm</option>
                </select>
                <br />
                <button
                    disabled={loading}
                    type="submit"
                >
                    {loading ? `Saving...` : `Save Entry`}
                </button>
            </form>
        </div>
    );
}

export default CreateEntry