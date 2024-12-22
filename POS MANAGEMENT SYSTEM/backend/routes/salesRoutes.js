const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// Define the route for fetching sales data per category
router.get('/category-sales', salesController.getCategorySalesData);

// Define the route for fetching sales data per user
router.get('/user-sales', salesController.getUserSalesData);

module.exports = router;
