import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditEntry() {
    const [content, setContent] = useState("");
    const [emoji, setEmoji] = useState("");
    const [error, setError] = useState("");
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect (()=> {

        const fetchContent = async () => {
            try{
                const token = localStorage.getItem("access_token");
                
                const response = await fetch(`http://127.0.0.1:8000/api/entries/${id}/`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                setContent(data.content);
                setEmoji(data.emoji);

            } catch {
                setError("Error fetch content");
            }
        }
        fetchContent();
    }, [id]);

    const handleEditing = async (e) => {
        e.preventDefault();

        if (!content) {
            setError("Empty content cannot update!");
            return;
        }

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

            if (response.ok) {
                navigate('/entries');
            } else {
                const data = await response.json();
                setError(data.error || "Failed to update entry.");
            }
        } catch(error) {
            setError(`Error editing content: ${error}`);
        }
        
    };

    return (
        <form onSubmit={handleEditing}>
            <textarea 
                rows="6"
                value={content}
                onChange={(e)=> setContent(e.target.value)}
            />
            <br />
            <select value={emoji} onChange={(e)=>setEmoji(e.target.value)}>
                <option value="">😐 None</option>
                <option value="😊">😊 Happy</option>
                <option value="😢">😢 Sad</option>
                <option value="😡">😡 Angry</option>
                <option value="😌">😌 Calm</option>
            </select>
            <button type="submit">Update</button>
            <button type="button" onClick={() => navigate('/entries')}>Cancel</button>
            {error && <div style={{color:"red"}}>{error}</div>}
        </form>
    );
}

export default EditEntry;