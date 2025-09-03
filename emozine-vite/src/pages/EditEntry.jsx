import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { readServerError, handleError401 } from "../utils/api"
import { EntryForm } from "../components/EntryForm";
import { useEntryValidation } from "../hooks/entries/useEntryValidation";
import { ENTRY_MIN_LENGTH } from "../config/validation";

function EditEntry() {
    const [content, setContent] = useState("");
    const [emoji, setEmoji] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const {id} = useParams();
    const entryRef = useRef(null);
    const navigate = useNavigate();
    const {contentLen, invalidMsg, guideMsg} = useEntryValidation(content, ENTRY_MIN_LENGTH);

    useEffect(() => {
        if (!loading && entryRef) {
            entryRef.current.focus();
        }
    },[loading]);

    useEffect (()=> {
        const token = localStorage.getItem("access_token");
        if (!token) {navigate(`/login`); return;}


        const fetchContent = async () => {
            try{
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
                    const msg = (await readServerError(response)) || `Failed to load entry for editing. (HTTP ${response.status})`
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

    const handleChangeContent = (e) => {
        setError("");
        setContent(e.target.value);
    }

    const handleEditing = async (e) => {
        e.preventDefault();

        if (submitting) return;
        setError("");

        if (invalidMsg) {
            setError(invalidMsg);
            return;
        }

        setSubmitting(true);

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
                setSubmitting(false);
                return;
            }

            if (response.ok) {
                navigate('/entries');
            } else {
                const msg = (await readServerError(response)) || `Failed editing (HTTP ${response.status})`;
                setError(msg);
            }
        } catch(err) {
            setError(err?.message || `Network error editing content.`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="edit-entry">
            <EntryForm 
                onSubmit={handleEditing}
                onContentChange={handleChangeContent}
                onEmojiChange={(e) => setEmoji(e.target.value)}
                onCancel={() => navigate('/dashboard')}
                loading={loading}
                submitting={submitting}
                content={content}
                error={error} 
                guideMsg={guideMsg}
                emoji={emoji}
                invalidMsg={invalidMsg}
                contentLen={contentLen}
                entryRef={entryRef}
            />
        </div>
    );
}

export default EditEntry;