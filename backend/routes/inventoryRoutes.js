import express from 'express';
import Inventory from '../models/Inventory.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { clinicFilter, withClinic } from '../middleware/clinicScope.js';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const items = await Inventory.find(clinicFilter(req)).sort({ name: 1 });
    res.json(items);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const item = await Inventory.create(withClinic(req, req.body));
    res.status(201).json(item);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const item = await Inventory.findOneAndUpdate({ _id: req.params.id, ...clinicFilter(req) }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const item = await Inventory.findOneAndDelete({ _id: req.params.id, ...clinicFilter(req) });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item removed' });
  })
);

export default router;
