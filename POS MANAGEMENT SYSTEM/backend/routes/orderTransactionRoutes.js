// routes/orderTransactionRoutes.js
const express = require('express');
const router = express.Router();
const orderTransactionController = require('../controllers/orderTransactionController');

// Route to add a transaction
router.post('/add', orderTransactionController.addOrderTransaction);

// Route to fetch all transactions
router.get('/', orderTransactionController.fetchOrderTransaction);





module.exports = router;