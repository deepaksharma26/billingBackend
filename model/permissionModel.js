let mongoose = require('mongoose');

let permissionsSchema = new mongoose.Schema({
    permissionName: {
        type: String,
        required: true,
        unique: true,
        trim: true 
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    status: {
        type: Boolean,
        default: true // Default status is active
    },     
    createdBy: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: String,
        required: false,
        default: null
    },
    updatedAt: {
        type: Date,
        default: null
    }
}, { collection: 'permissions', timestamps: true, _id: true }); 
module.exports = mongoose.model('Permission', permissionsSchema);
// Ensure you have the necessary imports and configurations for mongoose