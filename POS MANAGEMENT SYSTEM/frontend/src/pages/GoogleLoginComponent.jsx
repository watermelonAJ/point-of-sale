import React, { useContext, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/GoogleLoginComponent.css';

// Modal Component
const Modal = ({ showModal, closeModal, saveUserData, isLoading }) => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('Owner');
    const [error, setError] = useState('');
    const [userID, setUserID] = useState('');

    

    const handleSubmit = () => {
        if (!username.trim()) {
            setError('Username is required');
            return;
        }
    
        const generatedUserID = `USER-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        setError('');
        saveUserData(username, role, generatedUserID); // Pass generated userID directly
    };
    

    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content-google">
                <div className="modal-header">
                    <h3>Complete Your Profile</h3>
                    <button className="google-close-btn" onClick={closeModal}>×</button>
                </div>
                <div className="form-group">
                    <label className="label">Username</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="Enter your username"
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label className="label">Role</label>
                    <select 
                        value={role} onChange={(e) => setRole(e.target.value)}
                        className="input-field" reuired
                    >
                        <option value="Owner">Owner</option>
                        <option value="Cashier">Cashier</option>
                    </select>
                </div>
                <div className="button-group">
                    <button 
                        className="submit-btn" 
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                    <button 
                        className="cancel-btn" 
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const GoogleLoginComponent = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [manualPassword, setManualPassword] = useState('');
    const [userData, setUserData] = useState(null);
    const [notification, setNotification] = useState('');  // Add notification state

    const handleSuccess = async (credentialResponse) => {
        try {
            setIsLoading(true);
            setError('');
    
            const decoded = jwtDecode(credentialResponse.credential);
            const { given_name, family_name, email, sub } = decoded;
    
            // Check if user exists in the database
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/users/checkUserExistence`,
                { email }, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            if (response.data.exists) {
                if (response.data.message) {
                    setNotification(response.data.message);  // Handle the owner count message
                    return;  // Prevent login if the message is an error
                }
    
                setUser(response.data.user); // Assuming response includes the user object
                setNotification('Login successful!'); 
    
                // Set a timeout to navigate after 2 seconds
                setTimeout(() => {
                    navigate('/welcome', { 
                        state: { 
                            firstName: response.data.user.firstName, 
                            lastName: response.data.user.lastName, 
                            email: response.data.user.email 
                        } 
                    });
                }, 400);  
            } else {
                // If user does not exist, prepare registration
                const newUserData = {
                    firstName: given_name,
                    lastName: family_name,
                    email,
                    role: '',
                    username: '',
                    password: null,
                };
            
                setUserData(newUserData);
                setUser(newUserData);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error processing Google login:', error);
            setError('Failed to process login information. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    
    

    const handleError = () => {
        console.error('Google login failed!');
        setError('Failed to log in with Google. Please try again.');
    };

    const saveUserData = async (username, role, userID) => {
        try {
            setIsLoading(true);
            setError('');

            // Format role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    
            // Update local user state
            const updatedUserData = {
                ...userData,
                username,
                role: formattedRole,
                userID,
                password: manualPassword || null,
            };
    
            setUser(updatedUserData);
    
            // Send to backend
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/users/register`,
                updatedUserData,
                { 
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (response.data.success) {
                setNotification('Registration successful!');  // Display success message
                navigate('/welcome', { 
                    state: { 
                        firstName: updatedUserData.firstName, 
                        lastName: updatedUserData.lastName, 
                        email: updatedUserData.email 
                    } 
                });
            } else {
                setNotification(response.data.message || 'Registration failed. Please try again.');  // Display notification on failure
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setNotification(error.response?.data?.message || 'Failed to register user. Please try again.');  // Display error message
        } finally {
            setIsLoading(false);
            setShowModal(false);
        }
    };
    
    

    const closeModal = () => {
        if (!isLoading) {
            setShowModal(false);
            setError('');
        }
    };

    return (
        <div className="google-login-container">
            {notification && <div className="google-notification">{notification}</div>}  {/* Display notification */}
            
            <GoogleOAuthProvider 
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
                <div className="google-login">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        disabled={isLoading}
                    />
                </div>

                <Modal 
                    showModal={showModal} 
                    closeModal={closeModal} 
                    saveUserData={saveUserData}
                    isLoading={isLoading}
                />
            </GoogleOAuthProvider>
        </div>
    );
};

export default GoogleLoginComponent;
