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

// Report route
router.get('/report', authMiddleware, async (req, res) => {
  try {
    let { type, startDate, endDate, year, quarter, startYear } = req.query;
    let match = {};

    const now = new Date();

    if (type === 'date-range' && startDate && endDate) {
      match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (type === 'quarter' && year && quarter) {
      const q = parseInt(quarter, 10);
      const y = parseInt(year, 10);
      const start = new Date(y, (q - 1) * 3, 1);
      const end = new Date(y, q * 3, 1);
      match.createdAt = { $gte: start, $lt: end };
    } else if (type === '6months') {
      const end = now;
      const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      match.createdAt = { $gte: start, $lte: end };
    } else if (type === 'financial-year' && startYear) {
      const y = parseInt(startYear, 10);
      const start = new Date(y, 3, 1); // April 1
      const end = new Date(y + 1, 3, 1); // Next year's April 1
      match.createdAt = { $gte: start, $lt: end };
    }

    // Aggregation for sales, tax, payment method, summary
    const summary = await billingDetailsModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$finalAmount" },
          totalTax: { $sum: "$taxAmount" },
          count: { $sum: 1 }
        }
      }
    ]);

    const paymentMethods = await billingDetailsModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$paymentMethodDetails",
          totalSales: { $sum: "$finalAmount" },
          totalTax: { $sum: "$taxAmount" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Add: Get billing data list for the selected period, sorted by date descending
    const billingList = await billingDetailsModel.find(match)
      .sort({ createdAt: -1 });

    res.json({
      filter: type,
      summary: summary[0] || { totalSales: 0, totalTax: 0, count: 0 },
      paymentMethods,
      billingList // <-- detailed billing data for the selected period
    });
  } catch (error) {
    console.error('Report API error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;