const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["admin", "instructor", "user"],
            required: true
        },
    },
    { timestamps: true } // auto-adds createdAt and updatedAt
);

module.exports = mongoose.model('User', userSchema);