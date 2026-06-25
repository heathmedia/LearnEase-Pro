require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

// Middleware
const app = express();
const PORT = process.env.PORT || 5000;

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'LearnEase Pro API is running' });
});
app.use('/api/courses', require('./routes/courses'));

// 404 handler - runs only if no router above matched
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler - must have all 4 args for Express to recognize it
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});