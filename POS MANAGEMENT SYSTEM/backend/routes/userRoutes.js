const express = require('express');
const { registerUser, loginUser, checkUserExistence, updateUserDetails, fetchUsers} = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/checkUserExistence', checkUserExistence);

// Protect the update route with JWT authentication
router.post('/update', updateUserDetails);  // Add the middleware here

module.exports = router;
