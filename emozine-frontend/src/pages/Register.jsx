import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { readServerError } from "../utils/api"
import { useRegistrationValidation } from "../hooks/auth/useRegistrationValidation";
import { PASSWORD_MIN_LENGTH } from "../config/validation";
import { IdPwdForm } from "../components/IdPwdForm";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPwdFocus, setIsPwdFocus] = useState(false);
    const usernameRef = useRef(null);
    const navigate = useNavigate()
    const { isUsernameInvalid, isPasswordInvalid,  passwordGuide, minLength } = useRegistrationValidation(username, password, PASSWORD_MIN_LENGTH);
    const showPwdGuide = (isPwdFocus || isPasswordInvalid) && !!passwordGuide;

    useEffect(() => {
        if (usernameRef.current) {
            usernameRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
            });

            if (response.ok) {
                navigate('/login', { replace: true });
            } else {
                const msg = (await readServerError(response)) || `Registration failed (HTTP ${response.status})`;
                setError(msg);
            }
        } catch (error) {
            setError(error?.message || `Network error while registering`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <IdPwdForm
                onSubmit={handleSubmit}
                onUsernameChange={(e) => setUsername(e.target.value)}
                onPwdChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPwdFocus(true)}
                onBlur={() => setIsPwdFocus(false)}
                variant="register"
                usernameRef={usernameRef}
                username={username}
                loading={loading}
                minLength={minLength}
                password={password}
                isInvalid={isUsernameInvalid || isPasswordInvalid}
                error={error}
                showPwdGuide={showPwdGuide}
                passwordGuide={passwordGuide}
            />
        </div>
    );
}

export default Register;