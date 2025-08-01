let express = require('express');
let router = express.Router();
let financialYearModel = require('../model/finacialYearModel'); // Ensure the path to
// financial year model is correct
let authMiddleware = require('../middleware/auth'); // Ensure the path to auth middleware is correct    
const { create } = require('../model/userRoleModel');
// Create a new financial year
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, description, startDate, endDate, createdBy } = req.body;
        // Validate required fields
        if (!name || !startDate || !endDate) {
        return res.status(400).json({ message: 'All fields are required' });
        }
        // Create a new financial year document
        const financialYear = new financialYearModel({
        name,
        description,
        startDate,
        endDate,
        isActive: true, // Default to active
        createdBy: req.user._id, // Assuming request.user contains the authenticated user's info
        createdAt: new Date(),
        });
        // Save the financial year to the database
        await financialYear.save();
        res.status(201).json(financialYear);
    } catch (error) {
        console.error('Error creating financial year:', error);
        res.status(500).json({ message: 'Server error' });
    }
    });
// Get all financial years
router.get('/', authMiddleware, async (req, res) => {
    try {
        const financialYears = await financialYearModel.find({isActive: true }); // Fetch active financial years sorted by start date
        res.status(200).json(financialYears);
    } catch (error) {
        console.error('Error fetching financial years:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a financial year by ID
router.get('/:id', authMiddleware, async (req, res) => {    
    const financialYearId = req.params.id;
    try {
        const financialYear = await financialYearModel.findById(financialYearId);
        if (!financialYear) {
            return res.status(404).json({ message: 'Financial year not found' });
        }
        res.status(200).json(financialYear);
    } catch (error) {
        console.error('Error fetching financial year:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
);
// Update a financial year by ID
router.put('/:id', authMiddleware, async (req, res) => {
    const financialYearId = req.params.id;
    const { name, description, startDate, endDate, isActive } = req.body;
    try {
        const financialYear = await financialYearModel.findByIdAndUpdate(
            financialYearId,
            { name, description, startDate, endDate, isActive, updatedBy:req.user._id, updatedAt: new Date()   },
            { new: true }
        );
        if (!financialYear) {
            return res.status(404).json({ message: 'Financial year not found' });
        }
        res.status(200).json(financialYear);
    } catch (error) {
        console.error('Error updating financial year:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
);      
module.exports = router; // Export the router to use in the main app file