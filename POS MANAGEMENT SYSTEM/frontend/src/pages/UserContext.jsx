import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you're using axios for API requests

// Create UserContext
export const UserContext = createContext();

// Create UserProvider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        userID: '',
        firstName: '',
        lastName: '',
        username: '',
        role: '',
        email: '',
    });
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    // Fetch user data from localStorage on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
        setIsLoading(false); // Set loading to false after data is fetched
    }, []);

    // Update localStorage whenever user state changes
    useEffect(() => {
        if (user.username) {
            localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
            console.log('Stored user to localStorage:', user);
        }
    }, [user]);

    const handleRegister = async (newUser) => {
        try {
            const response = await axios.post('/api/register', newUser); // Assuming backend endpoint
            const registeredUser = response.data; // The backend sends user data, including userID
            setUser(registeredUser); // Update the user state in context
            localStorage.setItem('user', JSON.stringify(registeredUser)); // Update localStorage
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };
    

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('user'); // Clear localStorage
        setUser({
            userID: '',
            firstName: '',
            lastName: '',
            username: '',
            role: '',
            email: '',
        }); // Reset user state
    };

    return (
        <UserContext.Provider value={{ user, setUser, isLoading, handleRegister, handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};
