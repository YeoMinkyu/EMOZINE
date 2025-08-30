import { useMemo } from "react";

export function useEntryValidation(content, MIN_LENGTH=5) {
    const contentLen = content.trim().length;

    const invalidMsg = useMemo(()=> {
        if (contentLen === 0) {
            return `Please write something before saving.` 
        } else if (contentLen < MIN_LENGTH) {
            return `Write at least ${MIN_LENGTH} characters…`;
        } else {
            return null;
        }
    }, [contentLen, MIN_LENGTH])
    const guideMsg = useMemo(() => {
        if (contentLen === 0) return "Start typing your thoughts…";
        if (contentLen < MIN_LENGTH) return `Keep going — ${MIN_LENGTH - contentLen} more to go.`;
        return "";
    }, [contentLen, MIN_LENGTH]);

    return {contentLen, invalidMsg, guideMsg};
}

export function useLoginValidation(id="", password="") {
    const idLen = id.trim().length;
    const passwordLen = password.trim().length;

    const isInvalid = useMemo(() => {
        if (idLen === 0 || passwordLen === 0) return true;
        return false;
    }, [idLen, passwordLen]);

    return isInvalid;
}

export function useRegistrationValidation(id="", password="") {
    const idLen = id.trim().length;
    const passwordLen = password.trim().length;

    const isUsernameInvalid = useMemo(() => {
        if (idLen === 0) return true;
        return false; 
    }, [idLen]);

    const isPasswordInvalid = useMemo(() => {
        if (passwordLen === 0) return true;
        return false;
    }, [passwordLen]);

    return { isUsernameInvalid, isPasswordInvalid }
}