let mongoose = require('mongoose');
let billingCategoryModel = require('./billingcategoryModel'); // Ensure the path to category model is correct
let billingItemsSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    quantity: { type: Number, required: true },
    unitPrice: { type: mongoose.Schema.Types.Decimal128, required: true },
    totalPrice: { type:mongoose.Schema.Types.Decimal128, required: true },
    tax: { type: mongoose.Schema.Types.Decimal128, default: 0 }, // Tax applied to the billing particulars
    taxPercent: { type: String, default: 0 }, // Tax applied to the billing particulars
    discountPercent: { type: String, default: 0 }, // Tax applied to the billing particulars
    discount: { type: mongoose.Schema.Types.Decimal128, default: 0 }, // Discount applied to the
    category: { type: mongoose.Schema.Types.ObjectId, ref: billingCategoryModel, required: true }, // Reference to billing category
    createdBy: { type: String, required: false }, // User who created the billing particulars
    updatedBy: { type: String, required: false }, // User who last updated the billing particulars
    createdAt: { type: Date, default: Date.now }, // Timestamp of creation
    updatedAt: { type: Date,    default: null } // Timestamp of last update 
}, { collection: 'billingItems', timestamps: true });
const billingItemsModel = mongoose.model('billingItems', billingItemsSchema);
module.exports = billingItemsModel;