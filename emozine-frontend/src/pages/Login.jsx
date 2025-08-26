import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { readServerError } from "../utils/api"

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

            navigate('/dashboard');

            } else {
                const msg = (await readServerError(response)) || `Login falied. Check your username or password (HTTP ${response.status})`
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
            <h2>Login to EMOZINE</h2>
            {error && <p role="alert" className="error" style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit} className="login-form">
                <label>Username:</label>
                <input
                    disabled={loading}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label>Password:</label>
                <input
                    disabled={loading}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                disabled={loading}
                aria-disabled={loading}
                type="submit">
                    {loading ? "Signing in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;