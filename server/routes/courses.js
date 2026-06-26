const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, restrictTo } = require('../middleware/auth');

// GET /api/courses
router.get('/', protect, async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        next(err);
    }
});

// GET /api/courses:id
router.get('/:id', protect, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(course);
    } catch (err) {
        next(err);
    }
});

// POST /api/courses
router.post('/', protect, restrictTo('admin'), async (req, res, next) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (err) {
        next(err);
    }
});

// PATCH /api/courses
router.patch('/:id', protect, restrictTo('admin', 'instructor'), async (req, res, next) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
            next(err);
    }
})

module.exports = router;