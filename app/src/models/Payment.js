// models/Payment.js

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        transactionId: { type: String, required: true, unique: true },
        val_id: { type: String },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'BDT' },
        card_type: { type: String },
        store_amount: { type: Number },
        bank_tran_id: { type: String },
        risk_level: { type: String },
        payment_channel: { type: String, default: 'SSLCommerz' },
        status: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
        payment_date: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
