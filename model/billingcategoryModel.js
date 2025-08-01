let mongoose  = require("mongoose");

const billingcategoryModel = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['fixed', 'variable', 'physical', 'virtual'], required: false }, // Type of billing category
    isActive: { type: Boolean, default: true }, // Status of the billing category
    image: { type: String, required: false },
    createdBy: { type: String, required: true }, // User who created the category
    updatedBy: { type: String, required: true }, // User who last updated the   
    updatedAt: { type: Date, default: Date.now }, // Timestamp of last update
  },
  {
    collection: 'billingCategories',
    _id: true,
    timestamps: true,
  }
);  
const BillingCategory = mongoose.model("BillingCategory", billingcategoryModel);
module.exports = BillingCategory;
// Export the Category model