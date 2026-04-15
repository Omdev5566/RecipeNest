const mongoose = require('mongoose');

const {  DB_URL } = require('./config');

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL,)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the process with an error code
    }
};

module.exports = connectDB;
