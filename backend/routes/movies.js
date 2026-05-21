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

const fetchFromTmdb = async (path) => {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${BASE_URL}${path}&api_key=${API_KEY}`);
    const data = await response.json();
    return data;
};

const sendCachedResponse = (res, cacheKey, data) => {
    setCachedData(cacheKey, data);
    res.json(data);
};

// Get popular movies
router.get('/popular', async (req, res) => {
    const page = req.query.page || 1;
    const cacheKey = `popular:${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return res.json(cached);

    try {
        const data = await fetchFromTmdb(`/movie/popular?page=${page}`);
        sendCachedResponse(res, cacheKey, data.results || []);
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
        const data = await fetchFromTmdb('/genre/movie/list?language=en-US');
        sendCachedResponse(res, cacheKey, data.genres);
    } catch (error) {
        console.error('Error fetching genres:', error);
        res.status(500).json({ error: 'Failed to fetch genres' });
    }
});

// Search movies
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const page = req.query.page || 1;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const cacheKey = `search:${query}:${page}`;
        const cached = getCachedData(cacheKey);
        if (cached) return res.json(cached);

        const data = await fetchFromTmdb(
            `/search/movie?query=${encodeURIComponent(query)}&page=${page}`
        );
        sendCachedResponse(res, cacheKey, data.results || []);
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ error: 'Failed to search movies' });
    }
});

router.get('/discover', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const sortBy = req.query.sort_by || 'popularity.desc';
        const genre = req.query.genre;
        const year = req.query.year;

        const queryParts = [`/discover/movie?page=${page}`, `sort_by=${encodeURIComponent(sortBy)}`];
        if (genre) {
            queryParts.push(`with_genres=${encodeURIComponent(genre)}`);
        }
        if (year) {
            queryParts.push(`primary_release_year=${encodeURIComponent(year)}`);
        }

        const path = queryParts.join('&');
        const cacheKey = `discover:${path}`;
        const cached = getCachedData(cacheKey);
        if (cached) return res.json(cached);

        const data = await fetchFromTmdb(path);
        sendCachedResponse(res, cacheKey, data.results || []);
    } catch (error) {
        console.error('Error fetching discovery movies:', error);
        res.status(500).json({ error: 'Failed to fetch discovery movies' });
    }
});

router.get('/trending', async (req, res) => {
    const page = req.query.page || 1;
    const cacheKey = `trending:${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return res.json(cached);

    try {
        const data = await fetchFromTmdb(`/trending/movie/week?page=${page}`);
        sendCachedResponse(res, cacheKey, data.results || []);
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        res.status(500).json({ error: 'Failed to fetch trending movies' });
    }
});

router.get('/top-rated', async (req, res) => {
    const page = req.query.page || 1;
    const cacheKey = `top-rated:${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return res.json(cached);

    try {
        const data = await fetchFromTmdb(`/movie/top_rated?page=${page}`);
        sendCachedResponse(res, cacheKey, data.results || []);
    } catch (error) {
        console.error('Error fetching top-rated movies:', error);
        res.status(500).json({ error: 'Failed to fetch top-rated movies' });
    }
});

router.get('/upcoming', async (req, res) => {
    const page = req.query.page || 1;
    const cacheKey = `upcoming:${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return res.json(cached);

    try {
        const data = await fetchFromTmdb(`/movie/upcoming?page=${page}`);
        sendCachedResponse(res, cacheKey, data.results || []);
    } catch (error) {
        console.error('Error fetching upcoming movies:', error);
        res.status(500).json({ error: 'Failed to fetch upcoming movies' });
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