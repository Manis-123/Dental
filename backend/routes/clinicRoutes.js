import express from 'express';
import Clinic from '../models/Clinic.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const clinics = await Clinic.find({ isActive: true }).sort({ name: 1 });
    res.json(clinics);
  })
);

export default router;
