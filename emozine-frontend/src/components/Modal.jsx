import React from "react";

function Modal ({children, isOpen, onConfirm, onCancel, isDeleting, id}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div>
            <p>{children}</p>
            <button onClick={() => onConfirm(id)} disabled={isDeleting} aria-disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Yes"}
            </button>
            <button onClick={() => onCancel(false)} disabled={isDeleting} aria-disabled={isDeleting}>No</button>
        </div>
    );
}

export default Modal;