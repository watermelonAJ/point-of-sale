

const handleSubmit = async ({
    e,
    password,
    confirmPassword,
    setNotification,
    generateUserID,
    setUserID,
    role,
    firstName,
    lastName,
    email,
    username,
    setUser,
    setModalVisible,
}) => {
    e.preventDefault();

    // Validate passwords
    if (password !== confirmPassword) {
        setNotification('Passwords do not match!');
        return;
    }

    // Generate user ID
    generateUserID((err, generatedID) => {
        if (err) {
            console.error('Error generating user ID:', err);
            setNotification('Error generating User ID');
            return;
        }

        // Set user ID locally
        setUserID(generatedID);

        // Format role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

        // Data to be sent to the server
        const data = {
            firstName,
            lastName,
            email,
            username,
            password,
            role: formattedRole,
            userID: generatedID,
        };

        // Send POST request
        fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    const userData = {
                        firstName,
                        lastName,
                        email,
                        username,
                        role: formattedRole,
                        userID: generatedID,
                    };
                    setUser(userData); // Update context with new user data
                    localStorage.setItem('user', JSON.stringify(userData)); // Save user data to localStorage
                    setNotification('Registration successful!');
                    setModalVisible(true); // Show modal on success
                } else {
                    setNotification(result.message || 'Registration failed!');
                }
            })
            .catch((error) => {
                console.error('Error during registration:', error);
                setNotification('An error occurred during registration.');
            });
    });
};

export default handleSubmit;
