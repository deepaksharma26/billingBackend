//error log model
const mongoose = require('mongoose');
const errorLogSchema = mongoose.Schema(
    {
        message: { type: String, required: true }, // Error message
        stack: { type: String, required: true }, // Stack trace
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who encountered the error
        createdAt: { type: Date, default: Date.now }, // Timestamp of when the error occurred
    },
    {
        collection: 'errorLogs',
        timestamps: true,
    }
);
const ErrorLog = mongoose.model('ErrorLog', errorLogSchema);
module.exports = ErrorLog; // Export the ErrorLog model