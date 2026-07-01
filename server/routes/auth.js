const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { signToken } = require('../utils/token');

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required'});
        }

        // Must explicitly select the password since the schema hides it by default
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        // Same generic message whether the email or the password is wrong
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = signToken(user);

        res.json({
            token,
            user: { id: user._id, email: user.email, type: user.type },
        });
    } catch (err) {
        next(err);
    }
});

router.get('/logout', async (req, res, next) => {
    
});

// GET /api/auth/me - protected; returns the logged-in user
router.get('/me', protect, (req, res) => {
    res.json({ user: req.user });
});

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required'});
        }

        // Force type to 'user' - never let the client choose their own role
        const user = await User.create({ email, password, type: 'user' });

        const token = signToken(user);

        res.status(201).json({
            token,
            user: { id: user._id, email: user.email, type: user.type },
        });
    } catch (err) {
        // Duplicate email - the unique index throws E11000
        if (err.code === 11000) {
            return res.status(409).json({ error: 'An account with that email already exists' });
        }
        // Schema validation (e.g. password minlength) - return 400, not 500
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        next(err);
    }
});

module.exports = router;