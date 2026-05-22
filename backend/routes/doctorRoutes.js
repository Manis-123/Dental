import express from 'express';
import Doctor from '../models/Doctor.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { clinicFilter, withClinic } from '../middleware/clinicScope.js';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const doctors = await Doctor.find(clinicFilter(req)).sort({ name: 1 });
    res.json(doctors);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const doctor = await Doctor.create(withClinic(req, req.body));
    res.status(201).json(doctor);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor removed' });
  })
);

export default router;
