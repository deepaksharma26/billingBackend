let express = require('express');
let router = express.Router();
let authMiddleware = require('../middleware/auth'); // Ensure the path to auth middleware is correct
let billingItemsModel = require('../model/billingItemsModel'); // Ensure the path to billing items model is correct
const { create } = require('../model/userRoleModel');
// Create a new billing item
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, description, quantity, unitPrice, totalPrice, tax, discount, category } = req.body;
        // Validate required fields
        if (!name || !quantity || !unitPrice || !totalPrice || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Create a new billing item document
        const billingItem = new billingItemsModel({
            name,
            description,
            quantity,
            unitPrice,
            totalPrice: (((unitPrice * quantity) + tax) - discount), // Calculate total price based on unit price and quantity
            tax: tax || 0,
            discount: discount || 0,
            category,
            createdBy: req.user._id, 
            createdAt: new Date(),
        });
        // Save the billing item to the database
        await billingItem.save();
        res.status(201).json(billingItem);
    } catch (error) {
        console.error('Error creating billing item:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get all billing items
router.get('/', authMiddleware, async (req, res) => {
    try {
        const billingItems = await billingItemsModel.find({}).populate('category', 'name'); // Populate category name
        res.status(200).json(billingItems);
    } catch (error) {
        console.error('Error fetching billing items:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

);
// Get a billing item by ID
router.get('/:id', authMiddleware, async (req, res) => {
    const billingItemId = req.params.id;
    try {
        const billingItem = await billingItemsModel.findById(billingItemId).populate('category', 'name');
        if (!billingItem) {
            return res.status(404).json({ message: 'Billing item not found' });
        }
        res.status(200).json(billingItem);
    } catch (error) {
        console.error('Error fetching billing item:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update a billing item by ID
router.put('/:id', authMiddleware, async (req, res) => {    
    const billingItemId = req.params.id;
    const { name, description, quantity, unitPrice, totalPrice, tax, discount, category } = req.body;
    try {
        // Find billing item by ID and update
        const updatedBillingItem = await billingItemsModel.findByIdAndUpdate(billingItemId, {
            name,
            description,
            quantity,
            unitPrice,
            totalPrice,
            tax: tax || 0,
            discount: discount || 0,
            category,
            updatedBy: req.user._id // Assuming request.user contains the authenticated user's info
        }, { new: true });
        if (!updatedBillingItem) {
            return res.status(404).json({ message: 'Billing item not found' });
        }
        res.status(200).json(updatedBillingItem);
    } catch (error) {
        console.error('Error updating billing item:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
);
// Delete a billing item by ID
router.delete('/:id', authMiddleware, async (req, res) => {
    const billingItemId = req.params.id;
    try {
        const deletedBillingItem = await billingItemsModel.findByIdAndDelete(billingItemId);
        if (!deletedBillingItem) {
            return res.status(404).json({ message: 'Billing item not found' });
        }
        res.status(200).json({ message: 'Billing item deleted successfully' });
    } catch (error) {
        console.error('Error deleting billing item:', error);
        res.status(500).json({ message: 'Server error' });
    }
}   
);
module.exports = router; // Export the billing items routes