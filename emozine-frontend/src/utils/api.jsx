
export function handleError401 (response, navigate) {
    if (response.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            if (navigate) navigate('/login');
            return true;
        }
    return false;
}

export async function readServerError(response) {
    try{
        const body = await response.json();
        if (body?.detail) return body.detail;
        if (body?.error) return body.error;
        if (typeof body === 'string') return body;
        return null;
    } catch {
        return null;
    }
}