//error log
let express = require('express');
let router = express.Router();
let errorLogModel = require('../model/errorLogModel'); // Ensure the path to error log model is correct
let authMiddleware = require('../middleware/auth'); // Ensure you have an auth middleware

// Get all error logs
router.get('/', authMiddleware, async (req, res) => {
  try {
    const errorLogs = await errorLogModel.find().populate('userId', 'username'); // Populate userId with username
    res.status(200).json(errorLogs);
  } catch (error) {
    console.error('Error fetching error logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Create a new error log
router.post('/', authMiddleware, async (req, res) => {
  const { message, stack } = req.body;
  const userId = req.user.id; // Assuming req.user contains the authenticated user's info
  try {
    const newErrorLog = new errorLogModel({
      message,
      stack,
      userId,
    });
    await newErrorLog.save();
    res.status(201).json({ message: 'Error log created successfully', errorLog: newErrorLog });
  } catch (error) {
    console.error('Error creating error log:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; // Export the error log routes
// Ensure to include this route in your main app file (e.g., app.js or server.js)
// const errorLogRoutes = require('./routes/errorLog');
// app.use('/api/error-logs', errorLogRoutes);
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
