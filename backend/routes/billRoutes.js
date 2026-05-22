import express from 'express';
import Bill from '../models/Bill.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { clinicFilter, withClinic } from '../middleware/clinicScope.js';

const router = express.Router();

const calcTotals = (items, discount = 0) => {
  const subtotal = items.reduce((sum, i) => sum + i.amount, 0);
  const total = Math.max(0, subtotal - discount);
  return { subtotal, total };
};

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const bills = await Bill.find(clinicFilter(req))
      .populate('patient', 'name phone email')
      .populate('items.treatment', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(bills);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const bill = await Bill.findById(req.params.id)
      .populate('patient', 'name phone email address')
      .populate('items.treatment', 'name category')
      .populate('createdBy', 'name');
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.json(bill);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { patient, appointment, items, discount, paidAmount, paymentMethod, notes } = req.body;
    if (!patient || !items?.length) {
      return res.status(400).json({ message: 'Patient and items required' });
    }
    const mappedItems = items.map((i) => ({
      treatment: i.treatment || undefined,
      name: i.name,
      quantity: i.quantity || 1,
      unitPrice: i.unitPrice,
      amount: (i.quantity || 1) * i.unitPrice,
    }));
    const { subtotal, total } = calcTotals(mappedItems, discount || 0);
    const bill = await Bill.create(
      withClinic(req, {
        patient,
        appointment: appointment || undefined,
        items: mappedItems,
        subtotal,
        discount: discount || 0,
        total,
        paidAmount: paidAmount || 0,
        paymentMethod: paymentMethod || '',
        notes,
        createdBy: req.user._id,
      })
    );
    const populated = await Bill.findById(bill._id)
      .populate('patient', 'name phone')
      .populate('items.treatment', 'name');
    res.status(201).json(populated);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    const { items, discount, paidAmount, paymentMethod, notes, status } = req.body;

    if (items?.length) {
      const mappedItems = items.map((i) => ({
        treatment: i.treatment || undefined,
        name: i.name,
        quantity: i.quantity || 1,
        unitPrice: i.unitPrice,
        amount: (i.quantity || 1) * i.unitPrice,
      }));
      bill.items = mappedItems;
      const totals = calcTotals(mappedItems, discount ?? bill.discount);
      bill.subtotal = totals.subtotal;
      bill.total = totals.total;
    }
    if (discount !== undefined) {
      bill.discount = discount;
      bill.total = Math.max(0, bill.subtotal - discount);
    }
    if (paidAmount !== undefined) bill.paidAmount = paidAmount;
    if (paymentMethod !== undefined) bill.paymentMethod = paymentMethod;
    if (notes !== undefined) bill.notes = notes;
    if (status) bill.status = status;

    await bill.save();
    const updated = await Bill.findById(bill._id)
      .populate('patient', 'name phone')
      .populate('items.treatment', 'name');
    res.json(updated);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.json({ message: 'Bill removed' });
  })
);

export default router;
