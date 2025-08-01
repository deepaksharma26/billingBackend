// role permissions
let mongoose = require('mongoose');
let userPermissionSchema = new mongoose.Schema({
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'UserRole'
    },
    permissions: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Permission'
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
}, { collection: 'userPermission', timestamps: true, _id: true });
module.exports = mongoose.model('userPermission', userPermissionSchema);
// Ensure you have the necessary imports and configurations for mongoose