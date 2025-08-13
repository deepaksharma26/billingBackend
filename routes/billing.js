let express = require('express');
let router = express.Router();
let authMiddleware = require('../middleware/auth'); 
let billingDetailsModel = require('../model/billingDetailsModel'); 
let paymentTypeModel = require('../model/paymentTypeModel'); 
let User = require('../model/userSchema'); // Ensure the path to userSchema is correct


// Create a new billing detail
router.post('/', authMiddleware, async (req, res) => {  
    try {
        const {
            userId,
            plan,
            details,
            billingDetails,
            category,
            invoiceNumber,
            dueDate,
            totalAmount,
            taxAmount,
            discountAmount,
            finalAmount,
            currency,
            paymentStatus,
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
            customerNotes,
            financialYear,
            paymentMethodDetails,
            transactionId,
            nextBillingDate,
            remarks,    
        } = req.body;

        // Validate required fields
        if (!userId || !dueDate || !totalAmount || !finalAmount || !customerName) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Create a new billing detail document
        const billingDetail = new billingDetailsModel({
            userId,
            plan,
            details,
            billingDetails: billingDetails.map(item => ({
                ...item, 
                // totalPrice: item.unitPrice * item.quantity + (item.tax || 0) - (item.discount || 0)
            })),
            category,
            invoiceNumber,
            dueDate: new Date(dueDate),
            totalAmount: parseFloat(totalAmount),
            taxAmount: parseFloat(taxAmount) || 0,
            discountAmount: parseFloat(discountAmount) || 0,
            finalAmount: parseFloat(finalAmount),
            currency: currency || 'INR',
            paymentStatus: paymentStatus || 'Pending',
            customerName,
            customerEmail,
            customerPhone: customerPhone || '',
            customerAddress: customerAddress || '',
            customerNotes: customerNotes || '',
            financialYear: financialYear, // Validate financial year
            paymentMethodDetails: paymentMethodDetails || '', // Validate payment method
            transactionId,
            nextBillingDate: new Date(nextBillingDate),
            createdBy: req?.user?.id ?  req.user.id :'System', // Use System if user ID is not available" , 
        });
        console.log('Creating billing detail:', billingDetail);
        // Save the billing detail to the database
        await billingDetail.save();
        res.status(201).json(billingDetail);
    } catch (error) {
        console.error('Error creating billing detail:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
//update billing detail by ID
router.put('/:id', authMiddleware, async (req, res) => {
    const billingDetailId = req.body.id || req.params.id; 
    try {
        const billingDetail = await billingDetailsModel.findById({_id: billingDetailId});
        if (!billingDetail) {
            return res.status(404).json({ message: 'Billing detail not found' });
        }   
        const {
            userId,
            plan,
            details,
            billingDetails,
            category,
            invoiceNumber,
            dueDate,
            totalAmount,
            taxAmount,
            discountAmount,
            finalAmount,
            currency,
            paymentStatus,
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
            customerNotes,
            financialYear,
            paymentMethodDetails,
            transactionId,
            nextBillingDate,
            remarks,
        } = req.body;       
        // Validate required fields
        console.log('Updating billing detail with ID:', req.body);
        if (!userId || !totalAmount || !finalAmount || !customerName ) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }   
        // Update billing detail fields
        billingDetail.userId = userId;
        billingDetail.plan = plan;
        billingDetail.details = details;
        billingDetail.billingDetails = billingDetails.map(item => ({
            ...item,
            totalPrice: item.unitPrice * item.quantity + (item.tax || 0) - (item.discount || 0)
        }));
        billingDetail.category = category;
        billingDetail.invoiceNumber = invoiceNumber;
        billingDetail.dueDate = new Date(dueDate);
        billingDetail.totalAmount = parseFloat(totalAmount);
        billingDetail.taxAmount = parseFloat(taxAmount) || 0;   
        billingDetail.discountAmount = parseFloat(discountAmount) || 0;
        billingDetail.finalAmount = parseFloat(finalAmount);
        billingDetail.currency = currency || 'INR';
        billingDetail.paymentStatus = paymentStatus || 'Pending';
        billingDetail.customerName = customerName || '';
        billingDetail.customerEmail = customerEmail || '';
        billingDetail.customerPhone = customerPhone || '';
        billingDetail.customerAddress = customerAddress || '';
        billingDetail.customerNotes = customerNotes || '';
        billingDetail.remarks = remarks  || ''; 
        billingDetail.financialYear = financialYear; // Validate financial year
        billingDetail.paymentMethodDetails = paymentMethodDetails || ''; // Validate payment method
        billingDetail.transactionId = transactionId;
        billingDetail.nextBillingDate = new Date(nextBillingDate);
        billingDetail.updatedBy = req.user.id;
        billingDetail.updatedAt = new Date();       
        // Save the updated billing detail to the database
        await billingDetail.save(); 
        res.status(200).json(billingDetail);
    } catch (error) {
        console.error('Error updating billing detail:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
//mark billing detail as paid
router.put('/:id/pay', authMiddleware, async (req, res) => {
    const billingDetailId = req.params.id;
    try {
        const billingDetail = await billingDetailsModel.findById(billingDetailId);
        if (!billingDetail) {
            return res.status(404).json({ message: 'Billing detail not found' });
        }
        // Update payment status and payment date
        billingDetail.paymentStatus = 'Paid';
        billingDetail.paymentDate = new Date();
        billingDetail.paymentReference = req.body.paymentReference || '';   
        billingDetail.paymentMethodDetails = req.body.paymentMethodDetails || '';
        billingDetail.paymentGateway = req.body.paymentGateway || '';
        billingDetail.updatedBy = req.user.id;
        billingDetail.updatedAt = new Date();
        // Save the updated billing detail to the database
        await billingDetail.save();
        res.status(200).json(billingDetail);
    } catch (error) {
        console.error('Error marking billing detail as paid:', error);
        res.status(500).json({ message: 'Server error' });
    }
}); 
// Get all billing details by user ID
router.get('/user/:userId', authMiddleware, async (req, res) => {
    const userId = req.params.userId;
    try {
        const billingDetails = await billingDetailsModel.find({ userId })
            // .populate('billingDetails.billingItems', 'name quantity unitPrice totalPrice description tax discount')
            .populate('category', 'name')
            // .populate('financialYear', 'year')
            // .populate('paymentMethod', 'name')
            // .populate('createdBy', 'username')
            // .populate('updatedBy', 'username');
        res.status(200).json(billingDetails);
    } catch (error) {
        console.error('Error fetching billing details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

//get all billing details
router.get('/', authMiddleware, async (req, res) => {
    try {
        const billingDetails = await billingDetailsModel.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'users', // Ensure this matches your MongoDB collection name
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: {
                    path: '$userDetails',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);
        res.status(200).json(billingDetails);
    } catch (error) {
        console.error('Error fetching billing details:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
);
// Delete a billing detail by ID
router.delete('/:id', authMiddleware, async (req, res) => {
    const billingDetailId = req.params.id;
    try {
        const billingDetail = await billingDetailsModel.findByIdAndDelete(billingDetailId);
        if (!billingDetail) {
            return res.status(404).json({ message: 'Billing detail not found' });
        }
        res.status(200).json({ message: 'Billing detail deleted successfully' });
    } catch (error) {
        console.error('Error deleting billing detail:', error);
        res.status(500).json({ message: 'Server error' });
    }
  
});
//billing details by date range
router.get('/date-range', authMiddleware, async (req, res) => {
    const { startDate, endDate } = req.query;
    console.log('Fetching billing details by date range:', startDate, endDate);
    try {
        const billingDetails = await billingDetailsModel.find({
            billingDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        })
        // .populate('billingDetails.billingItems', 'name quantity unitPrice totalPrice description tax discount')
        // .populate('category', 'name')
        // .populate('financialYear', 'year')
        // .populate('paymentMethod', 'name')
        // .populate('createdBy', 'username')
        // .populate('updatedBy', 'username');
        
        res.status(200).json(billingDetails);
    } catch (error) {
        console.error('Error fetching billing details by date range:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
);  
//extract billing details by customerid
router.get('/customer/:customerId', authMiddleware, async (req, res) => {
    const customerId = req.params.customerId;
    try {
        const billingDetails = await billingDetailsModel.findOne({ userId: customerId },{customerName: 1, customerEmail: 1, customerPhone: 1, customerAddress: 1, customerNotes: 1, }).sort({ createdAt: -1 })
            // .populate('billingDetails.billingItems', 'name quantity unitPrice totalPrice description tax discount')
            // .populate('category', 'name')
            // .populate('financialYear', 'year')
            // .populate('paymentMethod', 'name')
            // .populate('createdBy', 'username')
            // .populate('updatedBy', 'username');
        res.status(200).json(billingDetails);
    } catch (error) {
        console.error('Error fetching billing details by customer ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
}); 
// Get a billing detail by ID
router.get('/:id', authMiddleware, async (req, res) => {
    const billingDetailId = req.params.id;
    console.log('Fetching billing detail with ID:', billingDetailId);
    try {
        const billingDetail = await billingDetailsModel.findById({ "_id": billingDetailId})
            // .populate('billingDetails.billingItems', 'name quantity unitPrice totalPrice description tax discount')
            // .populate('category', 'name')
            // .populate('financialYear', 'year')
            // .populate('paymentMethod', 'name')      
            // .populate('createdBy', 'username')
            // .populate('updatedBy', 'username'); 
        if (!billingDetail) {
            return res.status(404).json({ message: 'Billing detail not found' });
        }
        res.status(200).json(billingDetail);
    } catch (error) {
        console.error('Error fetching billing detail:', error);
        res.status(500).json({ message: 'Server error' });
    }     
});

module.exports = router; // Export the billing routes