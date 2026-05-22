import express from 'express';
import Appointment from '../models/Appointment.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { clinicFilter, withClinic } from '../middleware/clinicScope.js';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const appointments = await Appointment.find(clinicFilter(req))
      .populate('patient', 'name phone email')
      .populate('doctor', 'name specialization')
      .populate('treatment', 'name price')
      .sort({ date: 1 });
    res.json(appointments);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const appointment = await Appointment.create(withClinic(req, req.body));
    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'name phone')
      .populate('doctor', 'name specialization')
      .populate('treatment', 'name price');
    res.status(201).json(populated);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('patient', 'name phone')
      .populate('doctor', 'name specialization')
      .populate('treatment', 'name price');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment removed' });
  })
);

export default router;
