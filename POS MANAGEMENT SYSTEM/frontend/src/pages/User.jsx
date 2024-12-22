import React, { useState, useEffect, useContext } from 'react';
import Sidebar from './Sidebar';
import '../styles/User.css';
import { UserContext } from './UserContext';
import axios from 'axios'; // Ensure axios is imported

function User() {
    const { user } = useContext(UserContext); // Get user data from context

    // State to manage selected year and modal visibility
    const [selectedYear, setSelectedYear] = useState('2024');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false); // Track profile modal visibility
    const [showSubmitModal, setShowSubmitModal] = useState(false); // Track submit confirmation modal visibility

    // State to handle form inputs in modal
    const [username, setUsername] = useState(user.username);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [password, setPassword] = useState('');

    

    // State to handle error message
    const [errorMessage, setErrorMessage] = useState(''); // Add state for error message

    const handleYearClick = () => {
        setShowDropdown(!showDropdown); // Toggle the dropdown visibility
    };

    const handleYearSelect = (year) => {
        setSelectedYear(year); // Update selected year
        setShowDropdown(false); // Hide the dropdown after selection
    };

    // Toggle modal visibility
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    // Show the confirmation modal when submit is clicked
    const handleSubmitClick = () => {
        setShowSubmitModal(true); // Show confirmation modal
    };
    
    const handleConfirmSubmit = async () => {
        if (password !== confirmPassword) {
            alert("New password and confirm password do not match.");
            setShowSubmitModal(false); // Close the modal
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:5000/api/users/update', {
                email: user.email,
                currentPassword: currentPassword,
                newPassword: password
            });
    
            if (response.data.success) {
                alert(response.data.message || 'Password updated successfully');
                setPassword(''); // Reset password input
                setConfirmPassword(''); // Reset confirm password input
                setCurrentPassword(''); // Reset current password input
                setShowSubmitModal(false); // Close the modal
            } else {
                if (response.data.message === "Incorrect password") {
                    alert("Current password is incorrect.");
                } else {
                    setErrorMessage(response.data.message || 'Unexpected response from server.');
                }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again.';
            
            if (password !== confirmPassword && errorMessage === "Incorrect password") {
                alert("Incorrect password and new password is not the same with confirm password.");
            } else if (errorMessage === "Incorrect password") {
                alert("Current password is incorrect.");
            } else {
                setErrorMessage(errorMessage);
            }
        }
    };
    

    
    

    // Close confirmation modal without submitting
    const handleCancelSubmit = () => {
        setShowSubmitModal(false); // Close the confirmation modal without submitting
    };

    return (
        <div className="user-container">
            <Sidebar />
            <div className="user-main-content">
                <h1 className="user-header"> <img src="/user-icon.png" alt="Order Icon" className="user-icon" />User Profile</h1>
                <div className="user-profile-section">
                    {/* Profile Card */}
                    <div className="user-profile-card">
                        <div className="user-details">
                        <div className="user-field">
                                <p className="user-label">User ID</p>
                                <p className="user-value">{user.userID}</p>
                            </div>
                            <div className="user-field">
                                <p className="user-label">Name</p>
                                <p className="user-value">{user.firstName} {user.lastName}</p>
                            </div>
                            <div className="user-field">
                                <p className="user-label">Email</p>
                                <p className="user-value">{user.email}</p>
                            </div>
                            <div className="user-field">
                                <p className="user-label">Username</p>
                                <p className="user-value">{user.username}</p>
                            </div>
                            <div className="user-field">
                                <p className="user-label">Role</p>
                                <p className="user-value">{user.role}</p>
                            </div>
                        </div>
                        <button className="user-edit-button" onClick={toggleModal}>Edit Password</button>
                    </div>

                   
                </div>
            </div>

            {/* Modal for editing profile */}
            {showModal && (
                <div className="modal user-edit-profile">
                    <div className="modal-content">
                        <h2>Edit Profile</h2>
                        <div className="modal-form">

                            <div className="modal-field">
                                <label htmlFor="current-password">Current Password</label>
                                <input
                                    type="password"
                                    id="current-password"
                                    name="current-password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className="modal-field">
                                <label htmlFor="new-password">New Password</label>
                                <input
                                    type="password"
                                    id="new-password"
                                    name="new-password"
                                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="modal-field">
                                <label htmlFor="confirm-password">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    name="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-buttons">
                            <button
                                className="modal-submit-button"
                                onClick={handleSubmitClick} // Trigger confirmation modal on submit
                            >
                                Submit
                            </button>
                            <button className="modal-close-button" onClick={toggleModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal for Submit */}
            {showSubmitModal && (
                <div className="modal user-submit-changes">
                    <div className="modal-content">
                        <h2>Do you really want to submit these changes?</h2>
                        <div className="modal-buttons">
                            <button
                                className="modal-submit-button"
                                onClick={handleConfirmSubmit} // Proceed with password update
                            >
                                Yes
                            </button>
                            <button
                                className="modal-close-button"
                                onClick={handleCancelSubmit} // Close confirmation without submitting
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Display error message if there's an error */}
            {errorMessage && (
                <div className="error-message">{errorMessage}</div>
            )}
        </div>
    );
}

export default User;
