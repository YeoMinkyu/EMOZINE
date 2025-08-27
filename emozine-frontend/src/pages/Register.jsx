import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { readServerError } from "../utils/api"

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate()

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
                navigate('/login');
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
            <h2>Create an account</h2>
            <form onSubmit={handleRegister} className="register-form" aria-busy={loading}>
                <label>User Name:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    required
                />
                <label>Password:</label>
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    disabled={loading}
                    type="submit"
                >
                    {loading ? `Registering...` : `Register`}
                </button>
                {error && <p role="alert" style={{color: "red"}}>{error}</p>}
            </form>
        </div>
    );
}

export default Register;