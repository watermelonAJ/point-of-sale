const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Route to add a customer
router.post('/add', customerController.addCustomer);

// Route to delete a customer by customerID
router.delete('/delete/:customerID', customerController.deleteCustomer);
router.put('/updatePoints', customerController.updatePoints);

// Route to fetch all customers
router.get('/', customerController.fetchCustomers);

// Route to update a customer by customerID
router.put('/:id', customerController.updateCustomer);

router.get('/customers/:customerID/name', customerController.getCustomerNameHandler);


module.exports = router;
