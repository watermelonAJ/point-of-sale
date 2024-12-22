const handleSubmit = async ({
    e,
    email,
    password,
    setNotification,
    setUser,
    navigate,
}) => {
    e.preventDefault();

    const data = { email, password };

    console.log("Login data being sent:", data);

    try {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        console.log("Response from server:", response);

        const result = await response.json();
        console.log("Response data:", result);

        if (response.ok) {
            setUser({
                userID: result.userID, // Include userID
                firstName: result.firstName,
                lastName: result.lastName,
                username: result.username,
                email: result.email,
                role: result.role,
            });

            setNotification('Login successful!');

            setTimeout(() => {
                navigate('/welcome', {
                    state: {
                        userID: result.userID,
                        firstName: result.firstName,
                        lastName: result.lastName,
                        username: result.username,
                        email: result.email,
                        role: result.role,
                    },
                });
            }, 500);
        } else {
            console.error("Login error message:", result.message);
            setNotification(result.message || 'Login failed!');
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        setNotification('An error occurred during login.');
    }
};

export default handleSubmit;
