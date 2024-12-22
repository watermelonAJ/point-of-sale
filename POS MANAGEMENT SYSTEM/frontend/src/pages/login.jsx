import React, { useState, useContext } from 'react'; // Import useContext
import '../styles/login.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { UserContext } from './UserContext'; // Import UserContext
import GoogleLoginComponent from './GoogleLoginComponent';
import handleSubmit from '../actions/logIn/handleSubmit';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Initialize navigate
    const { setUser } = useContext(UserContext); // Access setUser from UserContext

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

   
    
    

    return (
        <div className="login-container">
            <div className="login-box">
                {notification && <div className="login-notification">{notification}</div>}
                <div className="login-logo">
                    <img src="logo.png" alt="Logo" />
                </div>
                <form  onSubmit={(e) =>
                        handleSubmit({
                            e,
                            email,
                            password,
                            setNotification,
                            setUser,
                            navigate,
                        })
                    }
                    cla className="login-form">
                    <div className="login-form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="login-form-group login-password-group">
                        <label>Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span onClick={togglePasswordVisibility} className="login-eye-icon">
                            {showPassword ? '👁️' : '🙈'}
                        </span>
                    </div>
                    <button type="submit" className="login-button">Log In</button>
                </form>
                <div className="login-alternative-buttons">
                    <Link to="/signup">
                        <button className="login-btn login-sign-up">Sign Up</button>
                    </Link>
                    <GoogleLoginComponent />
                </div>
            </div>
        </div>
    );
}

export default Login;
