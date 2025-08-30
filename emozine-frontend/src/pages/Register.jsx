import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { readServerError } from "../utils/api"
import { useRegistrationValidation } from "../hooks/useEntryValidation";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate()

    const { isUsernameInvalid, isPasswordInvalid } = useRegistrationValidation(username, password);

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
                <label htmlFor="username">User Name</label>
                <input
                    id="username"
                    name="username"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    disabled={isUsernameInvalid || isPasswordInvalid || loading}
                    type="submit"
                >
                    {loading ? `Registering...` : `Create account`}
                </button>
                {error && <p className="error" role="alert">{error}</p>}
                <label>Have an account?</label>
                <Link to={`/login`}>Log in</Link>
            </form>
        </div>
    );
}

export default Register;