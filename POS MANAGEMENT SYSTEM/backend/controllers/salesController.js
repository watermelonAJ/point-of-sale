const db = require('../db'); // Assuming you have a DB connection file

// Fetch sales data by category
const getCategorySalesData = (req, res) => {
    const sql = `
        SELECT c.idCategory, 
               c.nameCategory, 
               COALESCE(SUM(ot.Quantity * p.productPrice), 0) AS totalSales
        FROM category c
        LEFT JOIN products p ON c.idCategory = p.fkCategory
        LEFT JOIN orderTransaction ot ON p.SKU = ot.SKU
        LEFT JOIN transactions t ON ot.OrderNumber = t.OrderNumber
        GROUP BY c.idCategory, c.nameCategory;
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching sales data by category:', err);
            return res.status(500).json({ message: 'Error fetching sales data' });
        }

        res.json(results);
    });
};

// Fetch sales data by user for specific month and year
const getUserSalesData = (req, res) => {
    const { month, year } = req.query; // Extract month and year from query params

    // Query the database for sales by user for the specified month and year
    const sql = `
        SELECT 
            CONCAT(u.firstName, ' ', u.lastName) AS fullName, 
            SUM(t.TotalAmount) AS totalSales
        FROM 
            transactions t
        JOIN 
            users u ON t.fkuserID = u.userID
        WHERE 
            t.TransactionMonth = ? AND t.TransactionYear = ?
        GROUP BY 
            u.userID
        ORDER BY 
            totalSales DESC;
    `;

    db.query(sql, [month, year], (err, results) => {
        if (err) {
            console.error("Error fetching sales data by user:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        res.json(results); // Return the sales data
    });
};

module.exports = { getCategorySalesData, getUserSalesData };
