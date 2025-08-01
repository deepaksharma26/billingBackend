//error handler
let express = require('express');
let router = express.Router();
let errorLogModel = require('../model/errorLogModel'); // Ensure the path to error log
let authMiddleware = require('../middleware/auth'); // Ensure you have an auth middleware
// Error handling middleware
router.use((err, req, res, next) => {   
    console.error('Error occurred:', err);
    const errorLog = new errorLogModel({
        message: err.message,
        stack: err.stack,
        userId: req.user ? req.user.id : null, // Attach user ID if available
    });
    
    errorLog.save()
        .then(() => {
        res.status(500).json({ message: 'An error occurred', error: err.message });
        })
        .catch(saveError => {
        console.error('Error saving to error log:', saveError);
        res.status(500).json({ message: 'An error occurred, but failed to log the error' });
        });
    }
);
module.exports = router; // Export the error handler routes
