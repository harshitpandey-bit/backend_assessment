const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const userController = require('../controllers/helperController');

router.get('/', bookController.getBooksByName);
router.get('/rent', bookController.getBooksByRent);
router.get('/category', bookController.getBooksByCategoryAndFilters);


module.exports = router;
