import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import './styles.css';
// import Dashboard from './pages/Dashboard'; // Dashboard Component
import Navbar from './components/Navbar';  // Navbar Component
import AllVenues from './pages/AllVenues';
import CampusBuzz from './components/CampusBuzz'; 
import BookingStatus from './components/BookingStatus';   
import CheckRequests from './components/CheckRequests';
import BookVenueForm from './components/BookVenueForm';
import MaintenanceTab from './components/MaintenanceTab';
import CheckEquipment from './components/CheckEquipment'; 
import CalendarComponent from './components/CalendarComponent';

// import CustomCalendar from './components/Calendar';
// import ViewApprovedEvents from './components/MaintenanceTab';
// // import Header from './components/Header';


function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
    const validDomain = '@sahyadri.edu.in';



    // Handle Google login success
    const handleGoogleSuccess = (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            if (decoded.email.endsWith(validDomain)) {
                setIsAuthenticated(true); // Set authenticated on valid login
                localStorage.setItem('token', credentialResponse.credential); // Store token
                localStorage.setItem('email', decoded.email); // Store user email
            } else {
                setError('Only @sahyadri.edu.in emails are allowed.');
            }
        } catch (err) {
            setError('Google login failed. Invalid token.');
        }
    };

    const handleGoogleError = () => {
        setError('Google login failed. Please try again.');
    };

    // Handle manual form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.endsWith(validDomain)) {
            setError('Only @sahyadri.edu.in emails are allowed.');
            return;
        }
        setIsAuthenticated(true); // Assume successful login
        localStorage.setItem('email', email); // Store user email
        localStorage.setItem('role', role); // Store selected role
    };

    return (
     
        
        <GoogleOAuthProvider clientId="913405716395-qdmju9urgds2e90898pup56c4qb4h1qh.apps.googleusercontent.com">
            <Router>
                {/* <Header /> */}
                {isAuthenticated && <Navbar role={role} />} {/* Display Navbar if authenticated */}
                <Routes>
                    
                    {/* Login Route */}
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/dashboard" />
                            ) : (
                                <div className="app">
                                    <div className="login-container">
                                      {/* <div className='app-logo'>
                                        <img src="sahyadri_logo.jpg" alt="Sahyadri Logo" />
                                      </div>   */}
                                        <h2>Venue Booking Login</h2>
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="Enter your @sahyadri.edu.in email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Enter your password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Role</label>
                                                <select value={role} onChange={(e) => setRole(e.target.value)}>
                                                    <option value="student">Student</option>
                                                    <option value="faculty">Faculty</option>
                                                    <option value="authority">Authority</option>
                                                    <option value="maintenance">Maintenance</option>
                                                </select>
                                            </div>
                                            {error && <p className="error">{error}</p>}
                                            <button type="submit" className="btn">
                                                Login
                                            </button>
                                        </form>
                                        <div className="divider">OR</div>
                                        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                                    </div>
                                </div>
                            )
                        }
                    />

                    {/* Dashboard Route */}
                    <Route
                        path="/dashboard"
                        element={
                            isAuthenticated ? <CalendarComponent /> : <Navigate to="/" />
                        }
                    />
                    <Route path="/venues" element={<AllVenues />} />
                    <Route path="/campus-buzz" element={<CampusBuzz id = {localStorage.getItem('reportid')} requestId={localStorage.getItem('eventid')} report_url={localStorage.getItem('report_url')}/>} />
                    <Route path="/book-event" element={<BookVenueForm />} />
                    <Route path="/check-requests" element={<CheckRequests />} />
                    <Route path="/booking-status" element={<BookingStatus userEmail={localStorage.getItem('email')} />} />
                    <Route path="/authority/check-requests" element={<CheckRequests />} />
                    <Route path="/maintenance" element={<MaintenanceTab />} />
                    <Route path="/check-equipment" element={<CheckEquipment eventId= {localStorage.getItem('eventid')} equipmentStatus= {localStorage.getItem('equipmentStatus')}/>} />
                    <Route path="/campus-buzz" element={<CampusBuzz id= {localStorage.getItem('reportid')} />} />
                    
                
                    {/* <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/calendar" element={<CustomCalendar date= {localStorage.getItem('event_date')} />} /> */}
                </Routes>
            </Router>
        </GoogleOAuthProvider>
        
    );
}

export default App;
