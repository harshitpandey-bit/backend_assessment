const Book = require('../models/Book');





exports.getBooksByName = async (req, res) => {
    const term = req.query.term;

    
    if (!term || typeof term !== 'string' || term.trim() === '') {
        return res.status(400).json({ message: 'Invalid input. Please provide a valid book name or term.' });
    }

    try {
        const books = await Book.find({ name: { $regex: term, $options: 'i' } });

        
        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found matching the provided term.' });
        }

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBooksByRent = async (req, res) => {
    const { minRent, maxRent } = req.query;
    try {
        const books = await Book.find({
            rentPerDay: { $gte: minRent, $lte: maxRent }
        });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBooksByCategoryAndFilters = async (req, res) => {
    const { category, term, minRent, maxRent } = req.query;
    try {
        const books = await Book.find({
            category,
            name: { $regex: term, $options: 'i' },
            rentPerDay: { $gte: minRent, $lte: maxRent }
        });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 exports.getAllBook = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
};
