const mongoose = require('mongoose');
const logger = require('../utils/logger');
require('dotenv').config();
const connectDB = async () => {
    try {

    

mongoose.connect( process.env.MONGO_URI )
    .then(() => {
        logger.info('Database connected successfully');
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });
        
    } catch (error) {
        logger.error(`Database connection failed: ${error.message}`);
        process.exit(1);  
    }
};

module.exports = connectDB;
