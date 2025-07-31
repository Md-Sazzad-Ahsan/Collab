const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: { type: String, enum: ['active', 'expired'], default: 'active' },
    },
    { timestamps: true },
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
