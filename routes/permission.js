let express = require('express');   
let router = express.Router();
let permissionModel = require('../model/permissionModel');
let authMiddleware = require('../middleware/auth'); // Ensure you have an auth middleware for authentication
// Get all permissions
router.get('/', authMiddleware, async (req, res) => {
    try {
        const permissions = await permissionModel.find();
        res.status(200).json(permissions);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ message: 'Server error' });
    }
    }
);
// Create a new permission
router.post('/', authMiddleware, async (req, res) => {
    const { permissionName, description, status } = req.body;
    try {
        const newPermission = new permissionModel({
            permissionName,
            description,
            status,
            createdBy: req?.user?.id, // Use the authenticated user's ID
        });
        await newPermission.save();
        res.status(201).json({ message: 'Permission created successfully', permission: newPermission });
    } catch (error) {
        console.error('Error creating permission:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update a permission
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { permissionName, description, status } = req.body;
    try {
        const permissionToUpdate = await permissionModel.findById(id);
        if (!permissionToUpdate) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        permissionToUpdate.permissionName = permissionName || permissionToUpdate.permissionName;
        permissionToUpdate.description = description || permissionToUpdate.description;
        permissionToUpdate.status = status || permissionToUpdate.status;        
        permissionToUpdate.updatedBy = req?.user?.id; // Update the updater info
        permissionToUpdate.updatedAt = Date.now(); // Update the timestamp
        await permissionToUpdate.save();
        res.status(200).json({ message: 'Permission updated successfully', permission: permissionToUpdate });
    } catch (error) {
        console.error('Error updating permission:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete a permission
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const permissionToDelete = await permissionModel.findById(id);
        if (!permissionToDelete) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        await permissionToDelete.remove();
        res.status(200).json({ message: 'Permission deleted successfully' });
    } catch (error) {
        console.error('Error deleting permission:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
);