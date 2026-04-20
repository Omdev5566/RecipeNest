const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const app = express();
app.use(cookieParser());

// ✅ Enable CORS
app.use(cors({
  origin: "http://localhost:5173", // your frontend
  credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the MS Backend API (Phase 1)' });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// We will mount our resource routes here later:
const userRoutes = require('./routes/user.routes');
const recipeRoutes = require('./routes/recipe.routes');
const commentRoutes = require('./routes/comment.routes');
const authRoutes = require('./routes/auth.routes')
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/comments', commentRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;


