import express from 'express';
import Clinic from '../models/Clinic.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Bill from '../models/Bill.js';
import Treatment from '../models/Treatment.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.get(
  '/overview',
  asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [users, admins, staff, patients, doctors, treatments, appointments, bills, pendingBills, paidBills, todayAppointments] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'admin' }),
        User.countDocuments({ role: 'staff' }),
        Patient.countDocuments(),
        Doctor.countDocuments(),
        Treatment.countDocuments(),
        Appointment.countDocuments(),
        Bill.countDocuments(),
        Bill.countDocuments({ status: 'pending' }),
        Bill.countDocuments({ status: 'paid' }),
        Appointment.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
      ]);

    const [revenueResult, pendingAmountResult, recentBills, recentUsers] = await Promise.all([
      Bill.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$paidAmount' } } }]),
      Bill.aggregate([
        { $match: { status: { $in: ['pending', 'partial'] } } },
        { $project: { due: { $subtract: ['$total', '$paidAmount'] } } },
        { $group: { _id: null, total: { $sum: '$due' } } },
      ]),
      Bill.find()
        .populate('patient', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('billNumber patient total paidAmount status createdAt'),
      User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      users,
      admins,
      staff,
      patients,
      doctors,
      treatments,
      appointments,
      bills,
      pendingBills,
      paidBills,
      todayAppointments,
      revenue: revenueResult[0]?.total || 0,
      pendingAmount: pendingAmountResult[0]?.total || 0,
      recentBills,
      recentUsers,
    });
  })
);

router.post(
  '/clinics',
  asyncHandler(async (req, res) => {
    const clinic = await Clinic.create(req.body);
    res.status(201).json(clinic);
  })
);

router.put(
  '/clinics/:id',
  asyncHandler(async (req, res) => {
    const clinic = await Clinic.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });
    res.json(clinic);
  })
);

router.delete(
  '/clinics/:id',
  asyncHandler(async (req, res) => {
    const clinic = await Clinic.findByIdAndDelete(req.params.id);
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });
    res.json({ message: 'Clinic deleted successfully' });
  })
);

export default router;
