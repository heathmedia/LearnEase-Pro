const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Course title is required'],
            trim: true
        },
        description: {
            type: String,
            default: ''
        },
        instructor: {
            type: String,
            trim: true
        },
        published: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true } // auto-adds createdAt and updatedAt
);

module.exports = mongoose.model('Course', courseSchema);