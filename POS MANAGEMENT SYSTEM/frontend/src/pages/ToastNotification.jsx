import React, { useEffect, useState } from 'react';
import '../styles/ToastNotification.css'; // Import CSS for styling

const ToastNotification = ({ message, onClose, duration = 3000 }) => {
    const [isClosing, setIsClosing] = useState(false);

    // Automatically close the toast after the specified duration
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsClosing(true);
            setTimeout(onClose, 100); // Matches the CSS fade-out duration
        }, duration);

        return () => clearTimeout(timer); // Cleanup the timer
    }, [onClose, duration]);

    return (
        <div className={`toast-notification ${isClosing ? 'closing' : ''}`}>
            <p>{message}</p>
        </div>
    );
};

export default ToastNotification;
