const express = require('express');
const router = express.Router();

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Get popular movies
router.get('/popular', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        const data = await response.json();
        res.json(data.results);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        res.status(500).json({ error: 'Failed to fetch popular movies' });
    }
});

// Search movies
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const fetch = (await import('node-fetch')).default;
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        res.json(data.results);
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ error: 'Failed to search movies' });
    }
});

module.exports = router;