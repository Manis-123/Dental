import express from 'express';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import Bill from '../models/Bill.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { clinicFilter, withClinic } from '../middleware/clinicScope.js';
import treatmentImageRoutes from './treatmentImageRoutes.js';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const patients = await Patient.find(clinicFilter(req)).sort({ createdAt: -1 });
    res.json(patients);
  })
);

router.get(
  '/:id/history',
  asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ _id: req.params.id, ...clinicFilter(req) });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const [appointments, bills] = await Promise.all([
      Appointment.find({ patient: patient._id })
        .populate('doctor', 'name specialization')
        .populate('treatment', 'name price')
        .sort({ date: -1 }),
      Bill.find({ patient: patient._id }).sort({ createdAt: -1 }),
    ]);

    res.json({ patient, appointments, bills });
  })
);

router.use('/:patientId/images', treatmentImageRoutes);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ _id: req.params.id, ...clinicFilter(req) });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const patient = await Patient.create(withClinic(req, req.body));
    res.status(201).json(patient);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const patient = await Patient.findOneAndUpdate({ _id: req.params.id, ...clinicFilter(req) }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const patient = await Patient.findOneAndDelete({ _id: req.params.id, ...clinicFilter(req) });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient removed' });
  })
);

export default router;
