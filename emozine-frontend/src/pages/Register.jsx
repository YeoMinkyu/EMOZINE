import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { readServerError } from "../utils/api"
import { useRegistrationValidation } from "../hooks/useEntryValidation";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPwdFocus, setIsPwdFocus] = useState(false);
    const usernameRef = useRef(null);
    const navigate = useNavigate()
    const { isUsernameInvalid, isPasswordInvalid,  passwordGuide, minLength } = useRegistrationValidation(username, password);
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
    
    const handleRegister = async (e) => {
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
            <h2>Create account</h2>
            <form onSubmit={handleRegister} className="register-form" aria-busy={loading}>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username"
                    ref={usernameRef}
                    type="text"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    aria-describedby="password-help"
                    aria-invalid={isPasswordInvalid ? "true" : "false"}
                    value={password}
                    minLength={minLength}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPwdFocus(true)}
                    onBlur={() => setIsPwdFocus(false)}
                    required
                />
                <button
                    disabled={isUsernameInvalid || isPasswordInvalid || loading}
                    type="submit"
                >
                    {loading ? `Registering...` : `Create account`}
                </button>
                {
                    error
                    ? 
                        <p className="error" role="alert">{error}</p>
                    : 
                        showPwdGuide
                    ?   <small
                            id="password-help"
                            className="password-guide"
                            aria-live="polite"
                        >
                            {passwordGuide}
                        </small>
                    :
                        null
                }
                <label>Have an account?</label>
                <Link to={`/login`}>Log in</Link>
            </form>
        </div>
    );
}

export default Register;