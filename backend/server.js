const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/movies', require('./routes/movies'));

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Movie Recommendation Backend API' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});