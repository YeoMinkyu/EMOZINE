import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import EmptyIllustration from "../assets/writing.svg";
import "./EmptyState.css";

function EmptyState() {
    const navigate = useNavigate();
    const createRef = useRef(null);

    useEffect(()=>{
        if (createRef) {
            createRef.current.focus();
        }

    }, []) // [](empty dependancy list): run once when component mounts
    
    return (
        <div className="empty-state" role="status">
            <img src={EmptyIllustration} className="empty-image" alt="No entries yet" />
            <h3>No entries yet</h3>
            <p>Begin with a small note. Your feelings matter.</p>
            <button
            type="button"
            className="empty-state-button"
            ref={createRef}
            onClick={()=> navigate('/create')}>Write your first journal</button>
        </div>
    )
}

export default EmptyState