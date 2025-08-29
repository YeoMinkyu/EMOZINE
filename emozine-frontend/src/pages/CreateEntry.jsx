import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { readServerError, handleError401, validateMinLengthJournal } from "../utils/api"
import "./CreateEntry.css";

function CreateEntry () {
    const MIN_LENGTH = 5;
    const [content, setContent] = useState("");
    const [emoji, setEmoji] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const contentLen = content.trim().length;
    const invalidateMsg = validateMinLengthJournal(contentLen, MIN_LENGTH);
    const guideMsg = (() => {
    if (contentLen === 0) return "Please write something before saving.";
    if (contentLen < MIN_LENGTH) return `Please write at least ${MIN_LENGTH} characters.`;
    return ""; // once valid, no guide message
    })();


    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if(!token) {
            navigate('/login');
        }

    }, [navigate])

    const handleChangeContent = (e) => {
        setError("");
        setContent(e.target.value);
    }

    // handleSubmit with async-await and try catch to POST journal entry to backend('/api/entries/')
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (loading) return;
        
        setError("");
        setLoading(true);

        if (!!invalidateMsg) {
            setError(invalidateMsg);
            setLoading(false);
            return;
        }

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

            if (handleError401(response, navigate)) {
                setLoading(false);
                return;
            }

            if(response.ok) {
                navigate('/dashboard');
            } else {
                const msg = (await readServerError(response)) || `Failed to create entry (HTTP ${response.status})`;
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
            <form onSubmit={handleSubmit} aria-busy={loading}>
                <textarea
                    disabled={loading}
                    rows="6"
                    placeholder={`What's on your mind?`}
                    value={content}
                    onChange={handleChangeContent}
                />
                {(error && <p className="error-msg" role="alert">{error}</p> )|| (guideMsg && <p className="guide-msg">{guideMsg}</p>)}
                <br />
                <label>Choose an emoji: </label>
                <select 
                    disabled={loading}
                    value={emoji} 
                    onChange={(e) => setEmoji(e.target.value)    
                    }>
                        <option value="" aria-label="None">😐 None</option>
                        <option value="😊" aria-label="Happy">😊 Happy</option>
                        <option value="😢" aria-label="Sad">😢 Sad</option>
                        <option value="😡" aria-label="Angry">😡 Angry</option>
                        <option value="😌" aria-label="Calm">😌 Calm</option>
                </select>
                <br />
                <button
                    disabled={loading || invalidateMsg}
                    type="submit"
                >
                    {loading ? `Saving...` : `Save Entry`}
                </button>
            </form>
        </div>
    );
}

export default CreateEntry