const db = require('../db');

// Add a category
exports.addCategory = (req, res) => {
    const { nameCategory, descriptionCategory, dateCreated, addedBy, role, fkuserID	} = req.body;
    const checkQuery = `SELECT * FROM category WHERE nameCategory = ?`;
    
    db.query(checkQuery, [nameCategory], (err, result) => {
        if (err) return res.status(500).json({ message: 'Internal Server Error' });

        if (result.length > 0) return res.json({ message: 'Category already exists.' });

        const insertQuery = `INSERT INTO category (nameCategory, descriptionCategory, dateCreated, addedBy, role, fkuserID	) VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(insertQuery, [nameCategory, descriptionCategory, dateCreated, addedBy, role, fkuserID], (err) => {
            if (err) return res.status(500).json({ message: 'Internal Server Error' });
            res.status(201).json({ message: 'Category successfully added!' });
        });
    });
};

// Fetch categories
exports.getCategories = (req, res) => {
    const sql = "SELECT * FROM category";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching categories" });
        res.json(results);
    });
};

// Delete category
exports.deleteCategory = (req, res) => {
    const { nameCategory } = req.params;
    const sql = "DELETE FROM category WHERE nameCategory = ?";

    db.query(sql, [nameCategory], (err, result) => {
        if (err) return res.status(500).json({ message: "This category cannot be deleted because it is associated with other records." });

        if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found." });
        res.json({ message: "Category successfully deleted!" });
    });
};

// Update category
exports.updateCategory = (req, res) => {
    const { id } = req.params;
    const { nameCategory, descriptionCategory, updatedBy, updatedRole, dateUpdated } = req.body;
    
    const checkQuery = `SELECT * FROM category WHERE idCategory = ?`;
    db.query(checkQuery, [nameCategory, id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Internal Server Error' });

        if (results.length > 0) return res.json({ message: 'Category already exists.' });

        const updateQuery = `
            UPDATE category 
            SET nameCategory = ?, descriptionCategory = ?, updatedBy = ?, updatedRole = ?, dateUpdated = ?
            WHERE idCategory = ?`;
        
        db.query(updateQuery, [nameCategory, descriptionCategory, updatedBy, updatedRole, dateUpdated, id], (err, result) => {
            if (err) return res.status(500).json({ message: 'Internal Server Error' });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found.' });

            res.status(200).json({ message: 'Category successfully updated!' });
        });
    });
};