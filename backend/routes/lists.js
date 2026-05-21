const express = require('express');
const authenticate = require('../middleware/auth');
const UserList = require('../models/UserList');

const router = express.Router();
router.use(authenticate);

const validTypes = ['favorite', 'watchlist'];

router.get('/', async (req, res) => {
    const type = req.query.type;
    if (type && !validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid list type' });
    }

    try {
        const filter = { userId: req.user._id };
        if (type) filter.type = type;
        const list = await UserList.find(filter).sort({ addedAt: -1 });
        res.json(list);
    } catch (error) {
        console.error('Error fetching user list:', error);
        res.status(500).json({ error: 'Failed to fetch list items' });
    }
});

router.post('/', async (req, res) => {
    const { movieId, type, title, poster_path, release_date, vote_average, rating, notes } = req.body;
    if (!movieId || !type || !validTypes.includes(type)) {
        return res.status(400).json({ error: 'Missing or invalid list item data' });
    }

    try {
        const existing = await UserList.findOne({ userId: req.user._id, movieId, type });
        if (existing) {
            return res.status(409).json({ error: 'Movie already exists in list' });
        }

        const item = await UserList.create({
            userId: req.user._id,
            movieId,
            type,
            title,
            poster_path,
            release_date,
            vote_average,
            rating: rating || 0,
            notes: notes || '',
        });

        res.status(201).json(item);
    } catch (error) {
        console.error('Error creating list item:', error);
        res.status(500).json({ error: 'Failed to add item to list' });
    }
});

router.put('/:id', async (req, res) => {
    const updates = {};
    if (req.body.rating !== undefined) updates.rating = req.body.rating;
    if (req.body.notes !== undefined) updates.notes = req.body.notes;

    try {
        const item = await UserList.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            updates,
            { new: true }
        );
        if (!item) {
            return res.status(404).json({ error: 'List item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error('Error updating list item:', error);
        res.status(500).json({ error: 'Failed to update list item' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await UserList.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!deleted) {
            return res.status(404).json({ error: 'List item not found' });
        }
        res.json({ message: 'Item removed from list' });
    } catch (error) {
        console.error('Error deleting list item:', error);
        res.status(500).json({ error: 'Failed to delete list item' });
    }
});

module.exports = router;
