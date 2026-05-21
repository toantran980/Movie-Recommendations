const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
});

// Security and request middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(apiLimiter);

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lists', require('./routes/lists'));
app.use('/api/movies', require('./routes/movies'));

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Movie Recommendation Backend API' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});