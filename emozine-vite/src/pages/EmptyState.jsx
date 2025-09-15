import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import EmptyIllustration from "../assets/writing.svg";

function EmptyState() {
    const navigate = useNavigate();
    const createRef = useRef(null);

    useEffect(()=>{
        if (createRef) {
            createRef.current.focus();
        }

    }, []) // [](empty dependancy list): run once when component mounts
    
    return (
        <div>
            <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
                <img
                src={EmptyIllustration}
                className="bg-contain bg-center max-w-sm"
                alt="No entries yet" />
                <h3 className="h3-primary"> No entries yet</h3>
                <p>Begin with a small note. Your feelings matter.</p>
                <button
                    type="button"
                    className="button-primary"
                    ref={createRef}
                    onClick={()=> navigate('/create')}
                    aria-label="Start your first journal entry"
                >
                    Write your first journal
                </button>
            </div>
        </div>
    )
}

export default EmptyState