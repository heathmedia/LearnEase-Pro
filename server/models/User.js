const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: [8, "Password must be at least 8 characters"],
            select: false // Exclude from queries by default
        },
        type: {
            type: String,
            enum: ["admin", "instructor", "user"],
            required: true
        },
    },
    { timestamps: true } // auto-adds createdAt and updatedAt
);

// Hash the password before saving - only if changed
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare a plaintext password against the stored hash
userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
}

module.exports = mongoose.model('User', userSchema);