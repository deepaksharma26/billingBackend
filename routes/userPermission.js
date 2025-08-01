let express = require('express');
let router = express.Router();
let userPermissionModel = require('../model/userPermissionModel');
let authMiddleware = require('../middleware/auth'); // Ensure you have an auth middleware for authentication
// Get all user permissions
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userPermissions = await userPermissionModel.find().populate('roleId').populate('permissions');
        res.status(200).json(userPermissions);
    } catch (error) {
        console.error('Error fetching user permissions:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Create a new user permission
router.post('/', authMiddleware, async (req, res) => {
    const { roleId, permissions, status } = req.body;
    try {
        const newUserPermission = new userPermissionModel({
            roleId,
            permissions,
            status,
            createdBy: req?.user?.id, // Use the authenticated user's ID
        });
        await newUserPermission.save();
        res.status(201).json({ message: 'User permission created successfully', userPermission: newUserPermission });
    } catch (error) {
        console.error('Error creating user permission:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update a user permission
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { roleId, permissions, status } = req.body;
    try {
        const userPermissionToUpdate = await userPermissionModel.findById(id);
        if (!userPermissionToUpdate) {
            return res.status(404).json({ message: 'User permission not found' });
        }
        userPermissionToUpdate.roleId = roleId || userPermissionToUpdate.roleId;
        userPermissionToUpdate.permissions = permissions || userPermissionToUpdate.permissions;
        userPermissionToUpdate.status = status || userPermissionToUpdate.status;            
        userPermissionToUpdate.updatedBy = req?.user?.id; // Update the updater info
        userPermissionToUpdate.updatedAt = Date.now(); // Update the timestamp
        await userPermissionToUpdate.save();
        res.status(200).json({ message: 'User permission updated successfully', userPermission: userPermissionToUpdate });
    } catch (error) {
        console.error('Error updating user permission:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete a user permission
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const userPermissionToDelete = await userPermissionModel.findById(id);
        if (!userPermissionToDelete) {
            return res.status(404).json({ message: 'User permission not found' });
        }
        await userPermissionToDelete.remove();
        res.status(200).json({ message: 'User permission deleted successfully' });      
    } catch (error) {   
        console.error('Error deleting user permission:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router; // Export the router to use in your main app file