const bcrypt = require('bcryptjs');  // Import bcryptjs
const db = require('../db');
const generateUserID = require('../utils/generateUserID');

// Check if User Exists
exports.checkUserExistence = (req, res) => {
    const { email, role } = req.body;

    const sqlCheckUser = "SELECT * FROM users WHERE email = ?";
    const sqlCheckOwner = "SELECT * FROM users WHERE role = 'Owner' LIMIT 2";

    db.query(sqlCheckUser, [email], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error occurred" });
        }

        if (results.length > 0) {
            // User exists, check if role is 'Owner' and if there are already 2 owners
            if (role === 'Owner') {
                db.query(sqlCheckOwner, (err, ownerResults) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).json({ message: "Error checking for existing owners" });
                    }
                    if (ownerResults.length >= 0) {
                        return res.status(400).json({ message: "An owner account already exists. Only two owners can be registered." });
                    } else {
                        return res.status(200).json({ exists: true, user: results[0] });
                    }
                });
            } else {
                return res.status(200).json({ exists: true, user: results[0] });
            }
        } else {
            return res.status(200).json({ exists: false });
        }
    });
};




// Register User
// Register User
exports.registerUser = (req, res) => {
    const { userID, firstName, lastName, email, username, role, password } = req.body;

    // If password is not provided (i.e., user logged in via Google), set it to NULL
    const userPassword = password ? password : null;

    // Hash password if provided
    if (userPassword) {
        bcrypt.hash(userPassword, 10, (err, hashedPassword) => {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).json({ message: "Error hashing password" });
            }

            // Check if email or username already exists
            const sqlCheckEmail = "SELECT * FROM users WHERE email = ?";
            const sqlCheckUsername = "SELECT * FROM users WHERE username = ?";

            // Check if email already exists
            db.query(sqlCheckEmail, [email], (err, results) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ message: "Error checking email" });
                }

                if (results.length > 0) {
                    return res.status(400).json({ message: "Email is already taken" });
                }

                // Check if username already exists
                db.query(sqlCheckUsername, [username], (err, results) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).json({ message: "Error checking username" });
                    }

                    if (results.length > 0) {
                        return res.status(400).json({ message: "Username is already taken" });
                    }

                    // Check if an owner is already registered
                    if (role === 'Owner') {
                        const sqlCheckOwner = "SELECT * FROM users WHERE role = 'Owner' LIMIT 2";

                        db.query(sqlCheckOwner, (err, results) => {
                            if (err) {
                                console.error("Database error:", err);
                                return res.status(500).json({ message: "Error checking for existing owner" });
                            }

                            // If an owner already exists, prevent another owner registration
                            if (results.length > 0) {
                                return res.status(400).json({ message: "An owner account already exists. Only two owners can be registered." });
                            }

                            // Proceed with registration if no owner exists
                            registerUserInDatabase(req, res, userID, firstName, lastName, email, username, hashedPassword, role);
                        });
                    } else {
                        // Directly register non-owner roles like 'Cashier'
                        registerUserInDatabase(req, res, userID, firstName, lastName, email, username, hashedPassword, role);
                    }
                });
            });
        });
    } else {
        // If no password is provided, proceed with registration
        registerUserInDatabase(req, res, userID, firstName, lastName, email, username, null, role);
    }
};



// Helper function for database insertion
const registerUserInDatabase = (req, res, userID, firstName, lastName, email, username, userPassword, role) => {
    const sqlInsert = `
        INSERT INTO users (userID, firstName, lastName, email, username, password, role) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sqlInsert, [userID, firstName, lastName, email, username, userPassword, role], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Failed to register user" });
        }

        res.status(201).json({ success: true, message: "User registered successfully" });
    });
};

// User login (checking hashed password)
exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error("Database error:", err); // Log the database error
            return res.status(500).json({ message: "Database error occurred" });
        }

        if (data.length === 0) {
            console.log("No account found for email:", email); // Log when no account is found
            return res.status(401).json({ message: "No account found with that email." });
        }

        const user = data[0];
        
        // Compare hashed password with the entered password
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                return res.status(500).json({ message: "Error comparing passwords" });
            }

            if (result) {
                console.log("Login successful for user:", user.username); // Log successful login
                return res.json({
                    message: "Login successful!",
                    userID: user.userID,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                    role: user.role
                });
            } else {
                console.log("Incorrect password for user:", user.username); // Log incorrect password attempt
                return res.status(401).json({ message: "Incorrect password." });
            }
        });
    });
};




// Update User Details (hashing new password)
exports.updateUserDetails = (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    const sqlSelectUser = "SELECT * FROM users WHERE email = ?";
    db.query(sqlSelectUser, [email], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error occurred" });
        }

        if (data.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = data[0];

        // Check if the current password matches
        bcrypt.compare(currentPassword, user.password, (err, result) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                return res.status(500).json({ message: "Error comparing passwords" });
            }

            if (!result) {
                return res.status(400).json({ message: "Incorrect current password" });
            }

            // Hash the new password
            bcrypt.hash(newPassword, 10, (err, hashedNewPassword) => {
                if (err) {
                    console.error("Error hashing new password:", err);
                    return res.status(500).json({ message: "Error hashing new password" });
                }

                const sqlUpdateUser = "UPDATE users SET password = ? WHERE email = ?";
                db.query(sqlUpdateUser, [hashedNewPassword, email], (err, results) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).json({ message: "Failed to update password" });
                    }

                    if (results.affectedRows > 0) {
                        return res.status(200).json({ success: true, message: "Password changed successfully" });
                    } else {
                        return res.status(500).json({ message: "No rows were updated" });
                    }
                });
            });
        });
    });
};
