//billing model.js
const mongoose = require('mongoose');   
const billingModel = mongoose.Schema(
  {
    userId: { type: String, required: false }, // User ID associated with the billing record
    userMRN: { type: String, required: true }, // User ID associated with the billing record
    invoiceNumber: { type: String, required: true }, // Unique invoice number for the billing record
    invoiceDate: { type: Date, default: Date.now }, // Date of the invoice
    billingDetailsId: { type: String, required: true }, // User ID associated with the billing record
    billingType: { type: String, required: true }, 
    amount: { type: Number, required: true }, // Amount to be billed
    status: { type: String, required: true }, // Billing status (e.g., paid, pending, failed)
    paymentType: { type: String, required: true }, // Payment method used (e.g., credit card, PayPal)
    transactionId: { type: String, required: true }, // Transaction ID for the payment
    billingDate: { type: Date, default: Date.now }, // Date of the billing transaction
    nextBillingDate: { type: Date, required: false }, // Next billing date for recurring payments
    createdBy: { type: String, required: true }, // User who created the billing record
    createdAt: { type: Date, default: Date.now }, // Timestamp of record creation
    updatedBy: { type: String, required: false }, // User who last updated the billing record
    updatedAt: { type: Date, default: null }, // Timestamp of last update
  },
  {
    collection: 'billing',
    _id: true,
    timestamps: true,
  }
);  
const Billing = mongoose.model('Billing', billingModel);
module.exports = Billing; // Export the Billing model
// This model can be used to manage billing records in the application