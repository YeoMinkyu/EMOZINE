import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { readServerError } from "../utils/api"
import "./Login.css";
import { useLoginValidation } from "../hooks/useEntryValidation";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const isInvalid = useLoginValidation(username, password);

    useEffect(()=>{
        const token = localStorage.getItem('access_token');

        if (token) {
            navigate('/dashboard');
        }

    }, [navigate]);

    const handleSubmit = async (e) => {
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
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form" aria-busy={loading}>
                <label htmlFor="username">User Name</label>
                <input
                    id="username"
                    name="username"
                    disabled={loading}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    disabled={loading}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    disabled={loading || isInvalid}
                    aria-disabled={loading}
                    type="submit">
                        {loading ? "Logging in..." : "Login"}
                </button>
                {error && <p role="alert" className="error">{error}</p>}
                <label>No account?</label>
                <Link to={`/register`}>Sign up</Link>
            </form>
        </div>
    );
}

export default Login;