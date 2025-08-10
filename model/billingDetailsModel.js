//billingDetails.js
const mongoose = require('mongoose');
const billingDetailsSchema = mongoose.Schema(
  {
    userId: { type: String, required: true }, // User ID associated with the billing record
    plan: { type: String, required: true }, // Billing plan (e.g., monthly, yearly)
    details: { type: String, required: true }, // Details of the billing transaction
    billingDetails: [{
      billingItems: { type: String, required: false },
      name: { type: String, required: true }, // Name of the billing particulars
      quantity: { type: Number, required: true }, // Quantity of the billing particulars
      unitPrice: { type: Number, required: true }, // Unit price of the billing particulars
      totalPrice: { type: Number, required: true }, // Total price for the billing particulars
      description: { type: String, default: '' }, // Description of the billing particulars
      tax: { type: Number, default: 0 }, // Tax applied to the billing particulars
      discount: { type: Number, default: 0 }, 
    }], 
     // Reference to billing particulars
    category: { type: String, required: false }, // Reference to billing category
    invoiceNumber: { type: String, required: true }, // Unique invoice number for the billing record
    invoiceDate: { type: Date, default: Date.now }, // Date of the invoice
    dueDate: { type: Date, required: true }, // Due date
    totalAmount: { type: Number, required: true }, // Total amount to be billed
    taxAmount: { type: Number, default: 0 }, // Tax amount applied to the billing
    discountAmount: { type: Number, default: 0 }, // Discount amount
    finalAmount: { type: Number, required: true }, // Final amount after tax and discount
    currency: { type: String, default: 'USD' }, // Currency for the billing details
    paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Failed'], default: 'Pending' }, // Payment status of the billing record
    paymentDate: { type: Date, default: null }, // Date of payment
    paymentReference: { type: String, default: '' }, // Reference number for the payment
    paymentMethodDetails: { 
      type: String,  required: false
    }, // Details of the payment method used (e.g., credit card, bank transfer)
    paymentGateway: { type: String, default: '' }, // Payment gateway used for the transaction
    billingAddress: { type: String, default: '' }, // Billing address associated with the user
    customerName: { type: String, required: true }, // Name of the customer being billed
    customerEmail: { type: String, required: false }, // Email of the customer being billed
    customerPhone: { type: String, default: '' }, // Phone number of the customer being billed
    customerAddress: { type: String, default: '' }, // Address of the customer being billed
    customerNotes: { type: String, default: ''},
    remarks: { type: String, default: '' }, // Additional remarks for the billing record
    financialYear: { type: mongoose.Schema.Types.ObjectId, ref: 'financialYear' }, // Financial year for the billing record
    paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'paymentType', required: false }, // Payment method used (e.g., credit card, PayPal)
    transactionId: { type: String, required: false }, // Transaction ID for the payment
    billingDate: { type: Date, default: Date.now }, // Date of the billing transaction
    // nextBillingDate: { type: Date, required: false, default: Date.now }, // Next billing date for recurring payments
    createdBy: { type: String, required: true }, // User who created the billing record
    createdAt: { type: Date, default: Date.now }, // Timestamp of creation
    updatedBy: { type: String, required: false }, // User who last updated the billing record
    updatedAt: { type: Date, default: Date.now }, // Timestamp of last update
  },
  {
    collection: 'billingDetails',
    _id: true,
    timestamps: true,
  }
);
const BillingDetails = mongoose.model('BillingDetails', billingDetailsSchema);
module.exports = BillingDetails; // Export the BillingDetails model