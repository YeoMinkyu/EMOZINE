import { useMemo } from "react";

export function useLoginValidation(id="", password="", minLength=6) {
    const idLen = id.trim().length;
    const passwordLen = password.trim().length;

    const isInvalid = useMemo(() => {
        if (idLen === 0 || passwordLen < minLength) return true;
        return false;
    }, [idLen, passwordLen, minLength]);

    const passwordGuide = useMemo(() => {
        if (passwordLen < minLength) {
            return `Your password must be at least ${minLength} characters`;
        }
        return "";
    }, [passwordLen, minLength]);

    return {isInvalid, passwordGuide, minLength};
}