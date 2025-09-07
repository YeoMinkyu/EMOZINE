import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { readServerError } from "../utils/api"
import { useLoginValidation } from "../hooks/auth/useLoginValidation";
import { PASSWORD_MIN_LENGTH } from "../config/validation";
import { IdPwdForm } from "../components/IdPwdForm";
import "./Login.css";


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isPwdFocus, setIsPwdFocus] = useState(false);
    const usernameRef = useRef(null);
    const navigate = useNavigate();
    const {isInvalid, passwordGuide, minLength} = useLoginValidation(username, password, PASSWORD_MIN_LENGTH);
    const showPwdGuide = (isPwdFocus || isInvalid) && !!passwordGuide;

    useEffect(() => {
        if (usernameRef.current) {
            usernameRef.current.focus();
        }   
    }, []);

    useEffect(()=>{
        const token = localStorage.getItem('access_token');

        if (token) {
            navigate('/dashboard');
        }

    }, [navigate]);

    const handleSubmit = async (e) => {
        console.log(`[DEBUG]`);
        e.preventDefault(); // stop page reload
        if (loading) return;
        setError("");
        setLoading(true);

        try{
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);

                navigate('/dashboard', { replace: true });

            } else {
                const msg = (await readServerError(response)) || `Login failed. Check your username or password (HTTP ${response.status})`
                setError(msg);
            }
        } catch(error) {
            setError(error?.message || 'Network error while logging in');
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="login-container">
            <IdPwdForm
                onSubmit={handleSubmit}
                onUsernameChange={(e) => setUsername(e.target.value)}
                onPwdChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPwdFocus(true)}
                onBlur={() => setIsPwdFocus(false)}
                variant="login"
                usernameRef={usernameRef}
                username={username}
                loading={loading}
                minLength={minLength}
                password={password}
                isInvalid={isInvalid}
                error={error}
                showPwdGuide={showPwdGuide}
                passwordGuide={passwordGuide}
            />
        </div>
    );
}

export default Login;