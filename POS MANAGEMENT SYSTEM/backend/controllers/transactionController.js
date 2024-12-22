// controllers/transactionController.js
const db = require('../db');


// Add a new transaction
const addTransaction = (req, res) => {
    const {
        OrderNumber,
        CustomerID,
        PointsEarned = 0,
        TotalAmount,
        PayAmount,
        PointsUsed = 0,
        CashAmount,
        ChangeAmount,
        Cashier,
        TransactionDay,
        TransactionMonth,
        TransactionYear,
        fkuserID,
        TransactionTime,
        

    } = req.body;

   
    const sql = `
        INSERT INTO transactions 
        (OrderNumber, CustomerID, PointsEarned, TotalAmount, PayAmount, PointsUsed, CashAmount, ChangeAmount, Cashier, TransactionDay, TransactionMonth, TransactionYear, fkuserID, TransactionTime
)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [OrderNumber, CustomerID, PointsEarned, TotalAmount, PayAmount, PointsUsed, CashAmount, ChangeAmount, Cashier, TransactionDay, TransactionMonth,  TransactionYear, fkuserID, TransactionTime];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error adding transaction:", err);
            return res.status(500).json({ message: "Error adding transaction" });
        }

        res.status(201).json({ message: "Transaction successfully added!", OrderNumber });
    });
};

// Fetch all transactions
const fetchTransactions = (req, res) => {
    const sql = "SELECT * FROM transactions";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Error fetching transactions" });
        }
        res.json(results);
    });
};

const getTotalSales = (req, res) => {
    console.log('GET /api/transactions/total-sales route hit'); // Log when the route is accessed
    
    const sql = "SELECT SUM(IFNULL(PayAmount, 0)) AS totalSales FROM transactions";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err); // Log any error that occurs
            return res.status(500).json({ message: "Error fetching total sales", error: err });
        }

        console.log("Query results:", results); // Log the results of the query to check the value returned by the DB
        
        const totalSales = results[0].totalSales || 0; // Use 0 if no sales are found

        if (totalSales === 0) {
            console.log("No transactions found or no payments made"); // Log if no transactions are found
            return res.status(404).json({ message: "No transactions found or no payments made" });
        }

        console.log("Total Sales:", totalSales); // Log the total sales value before sending it back
        res.json({ totalSales }); // Send the total sales value as a response
    });
};








// Fetch a transaction by OrderNumber
const getTransactionByOrderNumber = (req, res) => {
    const { orderNumber } = req.params;

    const sql = "SELECT * FROM transactions WHERE OrderNumber = ?";
    db.query(sql, [orderNumber], (err, results) => {
        if (err) {
            console.error("Error fetching transaction:", err);
            return res.status(500).json({ message: "Error fetching transaction" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.json(results[0]);
    });
};


module.exports = {
    addTransaction,
    fetchTransactions,
    getTotalSales,
    getTransactionByOrderNumber,
    
};
