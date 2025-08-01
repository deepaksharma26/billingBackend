let express = require('express');
let router = express.Router();
let Setting = require('../model/settingModel'); // Ensure the path to setting model is correct
let authMiddleware = require('../middleware/auth'); // Ensure you have an auth middleware for authentication

// Get all settings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const settings = await Setting.find();
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
);
// Create a new setting
router.post('/', authMiddleware, async (req, res) => {  
    const { key, value, description } = req.body;
    const createdBy = req.user.id; // Assuming req.user contains the authenticated user's info
    try {
        const newSetting = new Setting({
        key,
        value,
        description,
        createdBy,
        updatedBy: createdBy, // Set the creator as the updater initially
        });
        await newSetting.save();
        res.status(201).json({ message: 'Setting created successfully', setting: newSetting });
    } catch (error) {
        console.error('Error creating setting:', error);
        res.status(500).json({ message: 'Server error' });
    }
    }
);
// Update a setting
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { key, value, description } = req.body;
    const updatedBy = req.user.id; // Assuming req.user contains the authenticated user's info
    try {
        const setting = await Setting.findById(id);
        if (!setting) {
        return res.status(404).json({ message: 'Setting not found' });
        }
        setting.key = key || setting.key;  
        setting.value = value || setting.value;
        setting.description = description || setting.description;
        setting.updatedBy = updatedBy; // Update the updater info
        setting.updatedAt = Date.now(); // Update the timestamp
        await setting.save();
        res.status(200).json({ message: 'Setting updated successfully', setting });
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({ message: 'Server error' });
    }
    }
);
// Delete a setting
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const setting = await Setting.findByIdAndDelete(id);
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }
        res.status(200).json({ message: 'Setting deleted successfully' });
    } catch (error) {
        console.error('Error deleting setting:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router; // Export the router