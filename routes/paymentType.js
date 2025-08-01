let express = require('express');
let router = express.Router();
let PaymentType = require('../model/paymentTypeModel'); // Ensure the path to payment type model is correct
let authMiddleware = require('../middleware/auth'); // Ensure you have an auth middleware for authentication
// Get all payment types
router.get('/', authMiddleware, async (req, res) => {
  try {
    const paymentTypes = await PaymentType.find();
    res.status(200).json(paymentTypes);
  } catch (error) {
    console.error('Error fetching payment types:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Create a new payment type
router.post('/', authMiddleware, async (req, res) => {
    const { paymentType, description } = req.body; 
    try {
        const newPaymentType = new PaymentType({
        paymentType,
        description,
        createdBy: req?.user?.id, // Use the authenticated user's username
        });
        await newPaymentType.save();
        res.status(201).json({ message: 'Payment type created successfully', paymentType: newPaymentType });
    } catch (error) {
        console.error('Error creating payment type:', error);
        res.status(500).json({ message: 'Server error' });
    }
    }   
);
// Update a payment type
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { paymentType, updatedBy } = req.body;
    try {
        const paymentTypeToUpdate = await PaymentType.findById(id);
        if (!paymentTypeToUpdate) {
            return res.status(404).json({ message: 'Payment type not found' });
        }
        paymentTypeToUpdate.paymentType = paymentType || paymentTypeToUpdate.paymentType;
        paymentTypeToUpdate.updatedBy = updatedBy; // Update the updater info
        paymentTypeToUpdate.updatedAt = Date.now(); // Update the timestamp
        await paymentTypeToUpdate.save();           
        res.status(200).json({ message: 'Payment type updated successfully', paymentType: paymentTypeToUpdate });
    } catch (error) {
        console.error('Error updating payment type:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete a payment type
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const paymentTypeToDelete = await PaymentType.findById(id);
        if (!paymentTypeToDelete) {
            return res.status(404).json({ message: 'Payment type not found' });
        }
        await paymentTypeToDelete.remove();
        res.status(200).json({ message: 'Payment type deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment type:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router; // Export the payment type routes