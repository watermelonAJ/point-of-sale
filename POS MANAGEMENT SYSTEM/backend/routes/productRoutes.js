const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


// Route to add a product
router.post('/add', productController.addProduct);

// Route to delete a product by SKU
router.delete('/delete/:sku', productController.deleteProduct);

// Route to fetch all products
router.get('/', productController.fetchProducts);

router.put('/updateQuantity', productController.updateProductQuantity);
// Route to update a product by SKU

router.put('/:SKU', productController.updateProduct);

// Route to fetch products with remaining quantity
router.get('/remainingQuantity', productController.fetchProductsWithRemainingQuantity);








module.exports = router;
