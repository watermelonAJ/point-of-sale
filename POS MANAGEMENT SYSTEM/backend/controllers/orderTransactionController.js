// controllers/orderTransactionController.js
const db = require('../db');


// Add a new transaction to orderTransaction
const addOrderTransaction = (req, res) => {
    const {
        OrderNumber,
        CustomerID,
        SKU,
        ProductName,
        Quantity,
        TransactionDay,
        TransactionMonth,
        TransactionYear,
        TransactionTime,
        Price,
        
    } = req.body;

    // SQL query to insert data into the orderTransaction table
    const sql = `
        INSERT INTO orderTransaction 
        (OrderNumber, CustomerID, SKU, ProductName, Quantity,  TransactionDay, TransactionMonth, TransactionYear, TransactionTime, Price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Values array to match the SQL placeholders
    const values = [OrderNumber, CustomerID, SKU, ProductName, Quantity, TransactionDay, TransactionMonth,   TransactionYear, TransactionTime, Price];

    // Execute the SQL query
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error adding transaction:", err);
            return res.status(500).json({ message: "Error adding transaction" });
        }

        res.status(201).json({ message: "Transaction successfully added!", OrderNumber });
    });
};


// Fetch all transactions
const fetchOrderTransaction = (req, res) => {
    const sql = "SELECT * FROM orderTransaction";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Error fetching transactions" });
        }
        res.json(results);
    });
};



module.exports = {
    addOrderTransaction,
    fetchOrderTransaction
};
