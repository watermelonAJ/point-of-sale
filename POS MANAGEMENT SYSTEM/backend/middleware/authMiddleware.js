const jwt = require('jsonwebtoken');

// Authentication middleware to verify JWT token
function verifyToken(req, res, next) {
    // Get token from the Authorization header
    const token = req.header('Authorization');

    // If no token is provided
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
        req.user = decoded.user;  // Attach decoded user to the request
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        // If token is not valid
        return res.status(401).json({ message: "Token is not valid" });
    }
}

module.exports = verifyToken;
