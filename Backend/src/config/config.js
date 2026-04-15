require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 8080,
    NODE_ENV: process.env.NODE_ENV || 'development',



    DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/cms_db',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',

    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
};