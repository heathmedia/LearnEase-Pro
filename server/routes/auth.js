const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

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

        const token = jwt.sign(
            { id: user._id, type: user.type },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        res.json({
            token,
            user: { id: user._id, email: user.email, type: user.type },
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/auth/me - protected; returns the logged-in user
router.get('/me', protect, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;