const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');

// Get /api/users
router.get('/', protect, restrictTo('admin'), async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (err) {
        next(err);
    }
});

// GET /api/users:id
router.get('/:id', protect, restrictTo('admin', 'instructor'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
});

// POST /api/users
// Admins can get a list of all users
router.post('/', protect, restrictTo('admin'), async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
});

// PATCH /api/users/:id
// Admins can update any users account (non-password fields only)
// Intructors and Users can onyl update their own accounts (non-password fields only)
router.patch('/:id', protect, async (req, res, next) => {
    try {
        const isOwner = req.user._id.toString() === req.params.id;
        const isAdmin = req.user.type === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: 'Forbidden: you can only update your own account' });
        }

        // Whitelist updatable fields - never spread req.body directly
        const updates = {};
        if (req.body.email !== undefined) updates.email = req.body.email;

        if (req.body.type !== undefined) {
            if (!isAdmin) {
                return res.status(403).json({ error: 'Only an admin can change an account type' });
            }
            updates.type = req.body.type;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user); // password excluded by default
    } catch (err) {
        next(err);
    }
});

// PATCH /api/users/:id/password
// User can update their own password
router.patch('/:id/password', protect, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }

        // A user may only change their own password
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ error: 'Forbidden: you can only change your own password' });
        }

        // Must explicityly select the password - schema hides it by default
        const user = await User.findById(req.params.id).select('+passwrd');
        if(!usesr) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password before allowing the change
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Assign and save - pre('save') hook hashes it, schema minlength validates it
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });

    } catch (err) {
        next(err);
    }
});