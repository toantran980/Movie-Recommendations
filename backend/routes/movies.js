const express = require('express');
const router = express.Router();

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Simple in-memory cache
const cache = {};
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const getCachedData = (key) => {
    const cached = cache[key];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
};

const setCachedData = (key, data) => {
    cache[key] = {
        data,
        timestamp: Date.now()
    };
};

// Get popular movies
router.get('/popular', async (req, res) => {
    const cacheKey = 'popular';
    const cached = getCachedData(cacheKey);
    if (cached) return res.json(cached);

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        const data = await response.json();
        setCachedData(cacheKey, data.results);
        res.json(data.results);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        res.status(500).json({ error: 'Failed to fetch popular movies' });
    }
});

// Get movie genres list
router.get('/genres', async (req, res) => {
    const cacheKey = 'genres';
    const cached = getCachedData(cacheKey);
    if (cached) return res.json(cached);

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        const data = await response.json();
        setCachedData(cacheKey, data.genres);
        res.json(data.genres);
    } catch (error) {
        console.error('Error fetching genres:', error);
        res.status(500).json({ error: 'Failed to fetch genres' });
    }
});

// Search movies
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const cacheKey = `search:${query}`;
        const cached = getCachedData(cacheKey);
        if (cached) return res.json(cached);

        const fetch = (await import('node-fetch')).default;
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setCachedData(cacheKey, data.results);
        res.json(data.results);
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ error: 'Failed to search movies' });
    }
});

// Get movie details (including cast/credits and videos/trailers)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const cacheKey = `movie:${id}`;
    const cached = getCachedData(cacheKey);
    if (cached) return res.json(cached);

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(
            `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,recommendations`
        );
        const data = await response.json();
        
        if (data.status_code === 34) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        setCachedData(cacheKey, data);
        res.json(data);
    } catch (error) {
        console.error(`Error fetching movie details for id ${id}:`, error);
        res.status(500).json({ error: 'Failed to fetch movie details' });
    }
});

module.exports = router;