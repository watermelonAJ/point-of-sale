const db = require('../db');
const generateCustomerID = require('../utils/generateCustomerID');


// Add a new customer
const addCustomer = (req, res) => {
    const {
        firstName,
        lastName,
        number,
        address,
        dateRegistered,
        registeredBy,
        role,
        fkuserID,
        payment,
    } = req.body;

    generateCustomerID((error, customerID) => {
        if (error) {
            return res.status(500).json({ message: 'Error generating customer ID.' });
        }

        const sql = `
            INSERT INTO customers (customerID, firstName, lastName, contactNumber, address, dateRegistered, registeredBy, roleRegisteredBy, fkuserID, payment)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [customerID, firstName, lastName, number, address, dateRegistered, registeredBy, role, fkuserID, payment];

        db.query(sql, values, (error, results) => {
            if (error) {
                console.error('Error adding customer:', error);
                return res.status(500).json({ message: 'Error adding customer. Please try again.' });
            }

            return res.json({
                message: 'Customer successfully added!',
                customer: {
                    customerID,
                    firstName,
                    lastName,
                    contactNumber: number,
                    address,
                    dateRegistered,
                    registeredBy,
                    roleRegisteredBy: role,
                    points: 0, // Initialize points to 0
                    fkuserID,
                },
            });
        });
    });
};


// Delete a customer
const deleteCustomer = (req, res) => {
    const customerID = req.params.customerID;

    const sqlDelete = "DELETE FROM customers WHERE customerID = ?";

    db.query(sqlDelete, [customerID], (err, result) => {
        if (err) {
            console.error("This category cannot be deleted because it is associated with other records", err);
            return res.status(500).json({ message: "This category cannot be deleted because it is associated with other records" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Customer not found" });
        }

        return res.json({ message: "Customer successfully deleted!" });
    });
};

// Fetch all customers
const fetchCustomers = (req, res) => {
    const sql = "SELECT * FROM customers";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error: ", err);
            return res.status(500).json({ message: "Error fetching customers" });
        }
        res.json(results);
    });
};

// Route to update customer points
const updatePoints = async (req, res) => {
    const { customerID, PointsUsed, PointsEarned } = req.body;

    try {
        // Perform the query using the MySQL connection
        db.query(
            'UPDATE customers SET points = points - ? + ? WHERE customerID = ?',
            [PointsUsed, PointsEarned, customerID],
            (err, results) => {
                if (err) {
                    console.error('Error updating customer points:', err);
                    return res.status(500).json({ message: 'Error updating points' });
                }

                // Check if the update was successful
                if (results.affectedRows > 0) {
                    return res.status(200).json({ message: 'Points updated successfully' });
                } else {
                    return res.status(400).json({ message: 'Customer not found' });
                }
            }
        );
    } catch (error) {
        console.error('Error updating customer points:', error);
        return res.status(500).json({ message: 'Error updating points' });
    }
};



// Update a customer
const updateCustomer = (req, res) => {
    const customerId = req.params.id;
    const { firstName, lastName, number, address, updatedBy, updatedRole, updatedDate } = req.body;

    const updateQuery = `
        UPDATE customers 
        SET firstName = ?, lastName = ?, contactNumber = ?, address = ?, 
            updatedBy = ?, updatedRole = ?, updatedDate = ?
        WHERE customerID = ?`;

    const values = [firstName, lastName, number, address, updatedBy, updatedRole, updatedDate, customerId];

    db.query(updateQuery, values, (error, results) => {
        if (error) {
            console.error("Error updating customer:", error);
            return res.status(500).json({ message: 'Error updating customer.' });
        }

        if (results.affectedRows > 0) {
            return res.json({ message: 'Customer successfully updated!' });
        } else {
            return res.status(404).json({ message: 'Customer not found.' });
        }
    });
};

const getCustomerNameHandler = (req, res) => {
    const { customerID } = req.params;
    const sql = 'SELECT CONCAT(firstName, " ", lastName) AS customerName FROM customers WHERE customerID = ?';
    db.query(sql, [customerID], (err, results) => {
        if (err) {
            console.error('Error fetching customer name:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length > 0) {
            return res.json({ customerName: results[0].customerName });
        } else {
            return res.status(404).json({ message: 'Customer not found' });
        }
    });
};


module.exports = {
    addCustomer,
    deleteCustomer,
    fetchCustomers,
    updateCustomer,
    updatePoints,
    getCustomerNameHandler
};
