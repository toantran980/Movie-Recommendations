const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.userId).select('-passwordHash');
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = authenticate;
