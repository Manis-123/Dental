import express from 'express';
import Appointment from '../models/Appointment.js';
import ReminderLog from '../models/ReminderLog.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { clinicFilter } from '../middleware/clinicScope.js';
import { sendAppointmentReminder } from '../services/reminderService.js';

const router = express.Router();

router.get(
  '/logs',
  asyncHandler(async (req, res) => {
    const logs = await ReminderLog.find().sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  })
);

router.get(
  '/tomorrow',
  asyncHandler(async (req, res) => {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const appointments = await Appointment.find({
      ...clinicFilter(req),
      date: { $gte: start, $lt: end },
      status: 'scheduled',
    })
      .populate('patient', 'name phone')
      .populate('doctor', 'name')
      .sort({ time: 1 });

    res.json(appointments);
  })
);

router.post(
  '/appointment/:id',
  asyncHandler(async (req, res) => {
    const appointment = await Appointment.findOne({ _id: req.params.id, ...clinicFilter(req) })
      .populate('patient', 'name phone')
      .populate('doctor', 'name');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    const channel = req.body.channel || 'whatsapp';
    const result = await sendAppointmentReminder(appointment, channel);
    if (result.status === 'sent' || result.status === 'mock') {
      appointment.reminderSentAt = new Date();
      await appointment.save();
    }
    res.json(result);
  })
);

router.post(
  '/tomorrow',
  asyncHandler(async (req, res) => {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const appointments = await Appointment.find({
      ...clinicFilter(req),
      date: { $gte: start, $lt: end },
      status: 'scheduled',
    })
      .populate('patient', 'name phone')
      .populate('doctor', 'name');

    const channel = req.body.channel || 'whatsapp';
    const results = [];
    for (const apt of appointments) {
      results.push(await sendAppointmentReminder(apt, channel));
      apt.reminderSentAt = new Date();
      await apt.save();
    }
    res.json({ sent: results.length, results });
  })
);

export default router;
