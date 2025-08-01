let mongoose = require('mongoose'); 
let userRoleSchema = new mongoose.Schema({
    rolename: {
        type: String,
        required: true,
        unique: true,
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
    updateBy: {
        type: String,
        required: false,
        default: null
    },
    updatedAt: {
        type: Date,
        default: null
    },
},{collection: 'userRoles', timestamps: true, _id: true});
module.exports = mongoose.model('UserRole', userRoleSchema);
// Ensure you have the necessary imports and configurations for mongoose