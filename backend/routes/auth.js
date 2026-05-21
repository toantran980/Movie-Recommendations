const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = require('../middleware/auth');

const router = express.Router();

const createToken = (user) => jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
);

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ email: normalizedEmail, passwordHash });
        const token = createToken(user);
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        res.cookie('token', token, cookieOptions);

        res.status(201).json({ user: { id: user._id, email: user.email } });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = createToken(user);
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        res.cookie('token', token, cookieOptions);

        res.json({ user: { id: user._id, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
    });
    res.json({ message: 'Logged out successfully' });
});

router.get('/me', authenticate, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
