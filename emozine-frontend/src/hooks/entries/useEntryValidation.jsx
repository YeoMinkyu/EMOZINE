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