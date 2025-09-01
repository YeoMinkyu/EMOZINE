import { useMemo } from "react";

export function useRegistrationValidation(id="", password="", minLength=6) {
    const idLen = id.trim().length;
    const passwordLen = password.trim().length;

    const isUsernameInvalid = useMemo(() => {
        if (idLen === 0) return true;
        return false; 
    }, [idLen, minLength]);

    const isPasswordInvalid = useMemo(() => {
        if (passwordLen < minLength) return true;
        return false;
    }, [passwordLen, minLength]);

    const passwordGuide = useMemo(() => {
        if (passwordLen < minLength) {
            return `Your password must be at least ${minLength} characters`;
        }
        return "";
    }, [passwordLen, minLength]);

    return { isUsernameInvalid, isPasswordInvalid, passwordGuide, minLength }
}