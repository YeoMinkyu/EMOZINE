import React from "react";

function Modal ({children, isOpen, onClickedYes, onClickedNo, id}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div>
            <p>{children}</p>
            <button onClick={() => onClickedYes(id)}>Yes</button>
            <button onClick={() => onClickedNo(false)}>No</button>
        </div>
    );
}

export default Modal;