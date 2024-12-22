const db = require('../db');
const generateSKU = require('../utils/generateSKU'); // Adjust the path as necessary

// Add a new product
const addProduct = (req, res) => {
    const {
        productName,
        productPrice,
        productQuantity,
        productUnit,
        fkCategory,
        addedBy,
        role,
        dateAdded,
        fkuserID
    } = req.body;

    const SKU = generateSKU();
    

    const sql = `
        INSERT INTO products 
        (SKU, productName, productPrice, productQuantity, productUnit, fkCategory, addedBy, role, dateAdded, fkuserID)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [SKU, productName, productPrice, productQuantity, productUnit, fkCategory, addedBy, role, dateAdded, fkuserID];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding product:', err);
            return res.status(500).json({ message: 'Error adding product' });
        }

        res.status(201).json({ message: 'Product successfully added!', SKU });
    });
};

const deleteProduct = (req, res) => {
    const { sku } = req.params; // Get the SKU from the request parameters

    // SQL query to delete the product
    const sql = 'DELETE FROM products WHERE SKU = ?';

    db.query(sql, [sku], (error, results) => {
        if (error) {
            console.error('Error deleting product:', error);
            return res.status(500).json({ message: 'This customer cannot be deleted because it is associated with other records.' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Send success response
        res.json({ message: 'Product deleted successfully' });
    });
};


// Fetch all products
const fetchProducts = (req, res) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error: ", err);
            return res.status(500).json({ message: "Error fetching products" });
        }
        res.json(results);
    });
};

// Update a product by SKU
const updateProduct = (req, res) => {
    const { SKU } = req.params;
    const { productName, productPrice, productQuantity, productUnit, fkCategory, updatedBy, updatedRole, fkUpdatedUserID } = req.body;

   
    // Check if the product already exists
    const checkQuery = `SELECT * FROM products WHERE SKU = ?`;
    db.query(checkQuery, [SKU], (err, results) => {
        if (err) return res.status(500).json({ message: 'Internal Server Error' });

        if (results.length === 0) return res.status(404).json({ message: 'Product not found' });

        // Update product details
        const updateQuery = `
            UPDATE products 
            SET productName = ?, productPrice = ?, productQuantity = ?, productUnit = ?, fkCategory = ?, updatedBy = ?, updatedRole = ?, dateUpdated = ?, fkUpdatedUserID = ? 
            WHERE SKU = ?`;

        db.query(updateQuery, [productName, productPrice, productQuantity, productUnit, fkCategory, updatedBy, updatedRole, new Date(), fkUpdatedUserID, SKU], (err, result) => {
            if (err) return res.status(500).json({ message: 'Internal Server Error' });

            if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });

            res.status(200).json({ message: 'Product successfully updated!' });
        });
    });
};









// Update product quantity by SKU
const updateProductQuantity = (req, res) => {
    const { SKU, productQuantity } = req.body;  // SKU and quantity from the request body

    // SQL query to update the product quantity
    const sql = `
        UPDATE products 
        SET productQuantity = productQuantity - ? 
        WHERE SKU = ?`;

    // Perform the query
    db.query(sql, [productQuantity, SKU], (err, results) => {
        if (err) {
            console.error('Error updating product quantity:', err);
            return res.status(500).json({ message: 'Error updating product quantity' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Return a success response
        res.json({ message: 'Product quantity successfully updated!' });
    });
};

const fetchProductsWithRemainingQuantity = (req, res) => {
    const sql = `
        SELECT 
            p.SKU, 
            p.productName, 
            p.productPrice, 
            p.productQuantity AS initialQuantity,
            p.productUnit,
            p.fkCategory,
            IFNULL(SUM(t.Quantity), 0) AS totalQuantitySold,
            (p.productQuantity - IFNULL(SUM(t.Quantity), 0)) AS remainingQuantity
        FROM products p
        LEFT JOIN transactions t ON p.SKU = t.SKU
        GROUP BY p.SKU;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching products with remaining quantity:', err);
            return res.status(500).json({ message: 'Error fetching products' });
        }

        res.json(results);
    });
};





module.exports = {
    addProduct,
    deleteProduct,
    fetchProducts, 
    updateProductQuantity,
    updateProduct,
    fetchProductsWithRemainingQuantity
   


};
