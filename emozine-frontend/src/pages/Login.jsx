import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
                setError('Login Falied. Check yoru username or password');
            }
        } catch(error) {
            setError('Login Falied. Check yoru username or password');
        }
        
    }

    return(
        <div className="login-container">
            <h2>Login to EMOZINE</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="login-form">
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label>Password:</label>
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;