const express = require('express');
const router = express.Router();
const billingDetailsModel = require('../model/billingDetailsModel');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/auth');

// Dashboard summary route
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Sum and count for today, grouped by payment type
    const todayByPaymentType = await billingDetailsModel.aggregate([
      { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
      { $group: {
          _id: "$paymentMethodDetails", 
          sum: { $sum: "$finalAmount" },
          count: { $sum: 1 }
      }}
    ]);

    // Billings for today
    const todayBillings = await billingDetailsModel.aggregate([
      { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: null, count: { $sum: 1 }, sum: { $sum: "$finalAmount" } } }
    ]);
    const todayCount = todayBillings[0]?.count || 0;
    const todaySum = todayBillings[0]?.sum || 0;

    // Billings for current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const monthBillings = await billingDetailsModel.aggregate([
      { $match: { createdAt: { $gte: startOfMonth, $lt: endOfMonth } } },
      { $group: { _id: null, sum: { $sum: "$finalAmount" } } }
    ]);
    const monthSum = monthBillings[0]?.sum || 0;

    // Month-wise billing sum by payment method (for pie chart)
    const paymentPie = await billingDetailsModel.aggregate([
      { $match: { createdAt: { $gte: startOfMonth, $lt: endOfMonth } } },
      { $group: { _id: "$paymentMethod", sum: { $sum: "$finalAmount" } } }
    ]);

    // Last 10 billings
    const last10 = await billingDetailsModel.find({})
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      today: { count: todayCount, sum: todaySum },
      month: { sum: monthSum },
      paymentPie,
      last10,
      todayByPaymentType // [{ _id: <paymentMethodId>, sum: <sum>, count: <count> }, ...]
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;