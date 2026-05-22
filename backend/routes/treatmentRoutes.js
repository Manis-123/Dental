import express from 'express';
import Treatment from '../models/Treatment.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { clinicFilter, withClinic } from '../middleware/clinicScope.js';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const treatments = await Treatment.find(clinicFilter(req)).sort({ name: 1 });
    res.json(treatments);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const treatment = await Treatment.create(withClinic(req, req.body));
    res.status(201).json(treatment);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!treatment) return res.status(404).json({ message: 'Treatment not found' });
    res.json(treatment);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const treatment = await Treatment.findByIdAndDelete(req.params.id);
    if (!treatment) return res.status(404).json({ message: 'Treatment not found' });
    res.json({ message: 'Treatment removed' });
  })
);

export default router;
