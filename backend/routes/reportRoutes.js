import express from 'express';
import Bill from '../models/Bill.js';
import Expense from '../models/Expense.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { clinicFilter } from '../middleware/clinicScope.js';

const router = express.Router();

router.get(
  '/monthly',
  asyncHandler(async (req, res) => {
    const year = Number(req.query.year) || new Date().getFullYear();
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const filter = { ...clinicFilter(req), createdAt: { $gte: start, $lt: end } };

    const bills = await Bill.find(filter)
      .populate('patient', 'name phone')
      .sort({ createdAt: -1 });

    const expenses = await Expense.find({ ...clinicFilter(req), date: { $gte: start, $lt: end } }).sort({
      date: -1,
    });

    const paidBills = bills.filter((b) => b.status === 'paid');
    const pendingBills = bills.filter((b) => b.status !== 'paid');
    const revenue = paidBills.reduce((s, b) => s + (b.paidAmount || 0), 0);
    const pendingAmount = pendingBills.reduce((s, b) => s + (b.total - (b.paidAmount || 0)), 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

    res.json({
      year,
      month,
      revenue,
      pendingAmount,
      totalExpenses,
      profit: revenue - totalExpenses,
      paidBillsCount: paidBills.length,
      pendingBillsCount: pendingBills.length,
      bills,
      pendingBills,
      expenses,
    });
  })
);

export default router;
