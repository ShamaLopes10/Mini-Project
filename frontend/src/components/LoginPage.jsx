import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import './LoginPage.css'; // Assuming this is the correct path for the CSS file

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            alert(response.data.message);
        } catch (error) {
            alert('Login failed');
        }
    };

    const handleGoogleLogin = async (response) => {
        console.log('Google login response:', response);
    };

    return (
        <div className="login-container">
            <div className="login-box">
            <div className="app-logo">
            <img src="sahyadri_logo.jpg" alt="Sahyadri Logo" />
            </div>
                {/* Heading */
                <h2>Venue Booking App</h2>
                }
                
                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="role">Role</label>
                        <select 
                            id="role" 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="authority">Authority</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>

                    <button type="submit" className="login-btn">Login</button>
                </form>

                {/* Google Login */}
                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    buttonText="Login with Google"
                    onSuccess={handleGoogleLogin}
                    onFailure={handleGoogleLogin}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
        </div>
    );
};

export default LoginPage;
