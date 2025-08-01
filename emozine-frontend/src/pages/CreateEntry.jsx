import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom"

function CreateEntry () {
    const [content, setContent] = useState("");
    const [emoji, setEmoji] = useState("");
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

            if(response.ok) {
                navigate('/dashboard');
            } else {
               setError("Failed to create entry.");
            }
        } catch (err) {
            setError("Error creating entry.");
        }
    }

    return (
        <div className="create-entry">
            <h2>Write a New Journal Entry</h2>
            {error && <p style={{color: "red"}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <textarea
                    rows="6"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e)=>setContent(e.target.value)}
                />
                <br />
                <label>Choose an emoji: </label>
                <select value={emoji} onChange={(e) => setEmoji(e.target.value)}>
                    <option value="">😐 None</option>
                    <option value="😊">😊 Happy</option>
                    <option value="😢">😢 Sad</option>
                    <option value="😡">😡 Angry</option>
                    <option value="😌">😌 Calm</option>
                </select>
                <br />
                <button type="submit">Save Entry</button>
            </form>
        </div>
    );
}

export default CreateEntry