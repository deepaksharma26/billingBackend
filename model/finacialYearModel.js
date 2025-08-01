let mongoose = require('mongoose');
let financialYearSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    startDate: { type: Date, required: true }, // Start date of the financial year
    endDate: { type: Date, required: true }, // End date of the financial year
    isActive: { type: Boolean, default: true }, // Status of the financial year
    createdBy: { type: String, required: false }, // User who created the financial year
    updatedBy: { type: String, required: false }, // User who last      
    updatedAt: { type: Date, default: Date.now }, // Timestamp of last update
    createdAt: { type: Date, default: Date.now }, // Timestamp of creation
},
    { collection: 'financialYear', timestamps: true }
);
const financialYearModel = mongoose.model('financialYear', financialYearSchema);
module.exports = financialYearModel;