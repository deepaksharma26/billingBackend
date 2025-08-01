let express = require('express');
let router = express.Router();
let userRoleSchema = require('../model/userRoleModel');

let authMiddleware = require('../middleware/auth'); // Ensure you have an auth middleware for authentication
// Get all user roles
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userRoles = await userRoleSchema.find();
    res.status(200).json(userRoles);
  } catch (error) {
    console.error('Error fetching user roles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Create a new user role
router.post('/', authMiddleware, async (req, res) => {  
    const { rolename, status } = req.body; 
    try {
        const newUserRole = new userRoleSchema({
        rolename,
        status,
        createdBy: req?.user?.id, // Use the authenticated user's ID 
        });
        await newUserRole.save();
        res.status(201).json({ message: 'User role created successfully', userRole: newUserRole });
    } catch (error) {
        console.error('Error creating user role:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
);
// Update a user role
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { rolename, status } = req.body;
    try {
        const userRoleToUpdate = await userRoleSchema.findById(id);
        if (!userRoleToUpdate) {
            return res.status(404).json({ message: 'User role not found' });
        }
        userRoleToUpdate.rolename = rolename || userRoleToUpdate.rolename;
        userRoleToUpdate.status = status || userRoleToUpdate.status;
        userRoleToUpdate.updateBy = req?.user?.id; // Update the updater info
        userRoleToUpdate.updatedAt = Date.now(); // Update the timestamp
        await userRoleToUpdate.save();           
        res.status(200).json({ message: 'User role updated successfully', userRole: userRoleToUpdate });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
);
// Delete a user role
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const userRoleToDelete = await userRoleSchema.findById(id);
        if (!userRoleToDelete) {
            return res.status(404).json({ message: 'User role not found' });
        }
        await userRoleToDelete.remove();
        res.status(200).json({ message: 'User role deleted successfully' });
    } catch (error) {
        console.error('Error deleting user role:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
);
module.exports = router; // Export the user role routes