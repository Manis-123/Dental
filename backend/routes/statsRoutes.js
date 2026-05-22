import express from 'express';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Treatment from '../models/Treatment.js';
import Bill from '../models/Bill.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [patients, doctors, treatments, totalAppointments, todayAppointments, scheduled, totalBills, pendingBills, paidBills] =
      await Promise.all([
        Patient.countDocuments(),
        Doctor.countDocuments(),
        Treatment.countDocuments(),
        Appointment.countDocuments(),
        Appointment.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
        Appointment.countDocuments({ status: 'scheduled' }),
        Bill.countDocuments(),
        Bill.countDocuments({ status: 'pending' }),
        Bill.countDocuments({ status: 'paid' }),
      ]);

    const [revenueResult, revenueByMonthRaw, todayAppointmentsList] = await Promise.all([
      Bill.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$paidAmount' } } }]),
      Bill.aggregate([
        { $match: { status: 'paid' } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            revenue: { $sum: '$paidAmount' },
          },
        },
      ]),
      Appointment.find({ date: { $gte: today, $lt: tomorrow } })
        .populate('patient', 'name phone')
        .populate('doctor', 'name')
        .populate('treatment', 'name')
        .sort({ time: 1 })
        .select('patient doctor treatment time status notes'),
    ]);

    const revenue = revenueResult[0]?.total || 0;

    const monthMap = new Map(
      revenueByMonthRaw.map((r) => [`${r._id.year}-${r._id.month}`, r.revenue])
    );
    const revenueChart = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      revenueChart.push({
        label: d.toLocaleString('en', { month: 'short' }),
        year,
        month,
        revenue: monthMap.get(`${year}-${month}`) || 0,
      });
    }

    res.json({
      patients,
      doctors,
      treatments,
      totalAppointments,
      todayAppointments,
      scheduled,
      totalBills,
      pendingBills,
      paidBills,
      revenue,
      revenueChart,
      todayAppointmentsList,
    });
  })
);

export default router;
