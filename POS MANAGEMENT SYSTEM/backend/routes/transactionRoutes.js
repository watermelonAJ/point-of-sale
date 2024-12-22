const express = require('express');
const router = express.Router();
const { addTransaction, fetchTransactions, getTotalSales, getTransactionByOrderNumber } = require('../controllers/transactionController');

// Route for adding a new transaction
router.post('/add', addTransaction);

// Route for fetching all transactions
router.get('/', fetchTransactions);

// Route for getting total sales
router.get('/total-sales', getTotalSales);  // Ensure this route is correct

// Route for fetching a transaction by OrderNumber
router.get('/:orderNumber', getTransactionByOrderNumber);

module.exports = router;
