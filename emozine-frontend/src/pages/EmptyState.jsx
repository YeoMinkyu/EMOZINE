import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"

function EmptyState() {
    const navigate = useNavigate();
    const createRef = useRef(null);

    useEffect(()=>{
        if (createRef) {
            createRef.current.focus();
        }

    }, []) // [](empty dependancy list): run once when component mounts
    
    return (
        <div role="status">
            <h3>No entries yet</h3>
            <p>Begin with a small note. Your feelings matter.</p>
            <button
            type="button"
            ref={createRef}
            onClick={()=> navigate('/create')}>Write your first journal</button>
        </div>
    )
}

export default EmptyState