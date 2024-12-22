import React from 'react';
import '../styles/Welcome.css';
import { Link, useLocation } from 'react-router-dom';

function Welcome() {
    const location = useLocation();
    const { firstName, lastName, userID } = location.state || {};

    return (
        <div className="welcome-container">
            <div className="welcome-box animated-container"> {/* Add animation class here */}
                <div className="welcome-logo">
                    <img src="logo.png" alt="SariPOS Logo" />
                </div>
                <Link to="/dashboard"> 
                    <button className="welcome-button">Continue to SARIPOS</button>
                </Link>
                <p className="welcome-text">
                    Welcome, {firstName} {lastName} to the SARIPOS with <br />
                    Simple, Smart, and Sari Sari POS
                </p>
            </div>
        </div>
    );
}

export default Welcome;
