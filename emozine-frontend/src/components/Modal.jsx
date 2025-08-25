import React, { useEffect, useRef } from "react";

function Modal ({children, isOpen, onConfirm, onCancel, isDeleting, id}) {
    const yesRef = useRef(null);

    useEffect(() => {
        if (isOpen && yesRef.current) {
            yesRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") {
                onCancel(null);
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKey);
        }

        return () => {
            window.removeEventListener("keydown", handleKey);
        }

    }, [isOpen, onCancel]);
    
    if (!isOpen) {
        return null;
    }

    return (
        <div>
            <p>{children}</p>
            <button
                ref={yesRef}
                onClick={() => onConfirm(id)}
                disabled={isDeleting}
                aria-disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Yes"}
            </button>
            <button
                onClick={() => onCancel(false)}
                disabled={isDeleting}
                aria-disabled={isDeleting}>
                No
            </button>
        </div>
    );
}

export default Modal;