import express from 'express';
import Expense from '../models/Expense.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { clinicFilter, withClinic } from '../middleware/clinicScope.js';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const expenses = await Expense.find(clinicFilter(req))
      .populate('createdBy', 'name')
      .sort({ date: -1 });
    res.json(expenses);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const expense = await Expense.create(
      withClinic(req, { ...req.body, createdBy: req.user._id, date: req.body.date || new Date() })
    );
    res.status(201).json(expense);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, ...clinicFilter(req) });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense removed' });
  })
);

export default router;
