import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate()
    
    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
            });

            if (response.ok) {
                navigate('/login');
            } else {
                const data = await response.json();
                setError(data.error || "Registration failed");
            }
        } catch {
            setError("Network error");
        }         
    };

    return (
        <div className="register-container">
            <h2>Create an account</h2>
            <form onSubmit={handleRegister} className="register-form">
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
                <button type="submit">Register</button>
                {error && <div style={{color: "red"}}>{error}</div>}
            </form>
        </div>
    );
}

export default Register;