import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"
import { readServerError, handleError401 } from "../utils/api"
import { EntryForm } from "../components/EntryForm";
import { useEntryValidation } from "../hooks/entries/useEntryValidation";
import { ENTRY_MIN_LENGTH } from "../config/validation";

function CreateEntry () {
    const [content, setContent] = useState("");
    const [emoji, setEmoji] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const entryRef = useRef(null);
    const navigate = useNavigate();
    const {contentLen, invalidMsg, guideMsg} = useEntryValidation(content, ENTRY_MIN_LENGTH);

    useEffect(() => {
        if (entryRef) {
            entryRef.current.focus();
        }
    },[]);

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if(!token) {
            navigate('/login');
            return;
        }

    }, [navigate]);

    const handleChangeContent = (e) => {
        setError("");
        setContent(e.target.value);
    }

    // handleSubmit with async-await and try catch to POST journal entry to backend('/api/entries/')
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (submitting) return;
        
        setError("");
        setSubmitting(true);

        if (invalidMsg) {
            setError(invalidMsg);
            setSubmitting(false);
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
                setSubmitting(false);
                return;
            }

            if(response.ok) {
                const responseData = await response.json();
                navigate('/dashboard', {state: 
                    { newEntry: responseData
                }});
            } else {
                const msg = (await readServerError(response)) || `Failed to create entry (HTTP ${response.status})`;
                setError(msg);
            }
        } catch (err) {
            setError(err?.message || `Network error while creating entry.`);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="create-entry">
            <EntryForm 
                onSubmit={handleSubmit}
                onContentChange={handleChangeContent}
                onEmojiChange={(e) => setEmoji(e.target.value)}
                onCancel={() => navigate('/dashboard')}
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

export default CreateEntry