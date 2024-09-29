


















const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/issue', transactionController.issueBook);
router.post('/return', transactionController.returnBook);
router.get('/book', transactionController.getTransactionHistoryByBook);
router.get('/book/rent', transactionController.getTotalRentByBook);
router.get('/user/:userId', transactionController.getBooksIssuedToUser);
router.get('/date-range', transactionController.getTransactionsByDateRange);

module.exports = router;
