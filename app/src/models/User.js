const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\+?\d{10,15}$/, 'Please enter a valid phone number'],
    },
    password: { type: String, required: true },

    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },

    is_premium: { type: Boolean, default: false },

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
});

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
