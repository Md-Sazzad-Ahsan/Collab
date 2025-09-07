const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: { type: String, enum: ['active', 'expired'], default: 'active' },
        duration: { type: String, enum: ['monthly', 'yearly'], required: true }, // NEW
        amount: { type: Number, required: true }, // NEW
        currency: { type: String, required: true, default: 'BDT' }, // NEW
    },
    { timestamps: true },
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
