const express = require('express');
const { addCategory, getCategories, deleteCategory, updateCategory } = require('../controllers/categoryController');
const router = express.Router();

router.post('/', addCategory);
router.get('/', getCategories);
router.delete('/:nameCategory', deleteCategory);
router.put('/:id', updateCategory);

module.exports = router;
