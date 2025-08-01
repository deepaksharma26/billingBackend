//payment methods
const mongoose = require('mongoose');
const paymentTypeSchema = mongoose.Schema(
  {
    paymentType: { type: String, required: true }, // Type of payment method (e.g., credit card, PayPal)
    description: { type: String, default: '' }, // Description of the payment method
    status: { type: Boolean, default: true }, // Type of payment method (e.g., credit card, PayPal)
    createdBy: { type: String, default: Date.now }, // User who created the payment method
    updatedBy: { type: String, default: null}, // User who last updated the payment method
    updatedAt: { type: Date, default: null }, // Timestamp of last update
  },
  {
    collection: 'paymentType',
    _id: true,      
    timestamps: true,
    }
);
const PaymentType = mongoose.model('PaymentType', paymentTypeSchema);
module.exports = PaymentType; // Export the PaymentMethod model