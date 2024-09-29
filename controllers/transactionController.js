const Transaction = require("../models/Transaction");
const Book = require("../models/Book");
const User = require("../models/User");

exports.issueBook = async (req, res) => {
  const { bookName, userId, issueDate } = req.body;
  try {
    const book = await Book.findOne({ name: bookName });
    const user = await User.findById(userId);
    if (!book || !user) return res.status(404).send("Book or User not found");

    const transaction = new Transaction({
      bookId: book._id,
      userId,
      issueDate,
    });
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.returnBook = async (req, res) => {
  const { bookName, userId, returnDate } = req.body;
  try {
    const book = await Book.findOne({ name: bookName });
    const transaction = await Transaction.findOne({
      bookId: book._id,
      userId,
      returnDate: null,
    });
    if (!transaction)
      return res.status(404).send("No active transaction found");

    const daysRented = Math.ceil(
      (new Date(returnDate) - new Date(transaction.issueDate)) /
        (1000 * 60 * 60 * 24)
    );
    transaction.returnDate = returnDate;
    const rentPerDay = (await Book.findById(book._id)).rentPerDay;
    transaction.rentAmount = daysRented * rentPerDay;

    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactionHistoryByBook = async (req, res) => {
  const { bookName } = req.query;
  try {
    const book = await Book.findOne({ name: bookName });
    console.log(book._id);
    
    const transactions = await Transaction.find({ bookId: book._id }).populate(
      "userId"
    );

    const currentlyIssued = transactions.find((t) => !t.returnDate);
    const history = transactions.filter((t) => t.returnDate);

    res.json({
      currentlyIssued: currentlyIssued ? currentlyIssued.userId : null,
      totalIssued: history.length,
      history: history.map((t) => t.userId),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTotalRentByBook = async (req, res) => {
  const { bookName } = req.query;
  try {
    const book = await Book.findOne({ name: bookName });
    const transactions = await Transaction.find({
      bookId: book._id,
      returnDate: { $ne: null },
    });
    const totalRent = transactions.reduce((sum, t) => sum + t.rentAmount, 0);
    res.json({ totalRent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBooksIssuedToUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const transactions = await Transaction.find({ userId }).populate("bookId");
    res.json(transactions.map((t) => t.bookId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactionsByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const transactions = await Transaction.find({
      issueDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).populate("bookId userId");

    res.json(transactions.map((t) => ({ book: t.bookId, user: t.userId })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
