import express from 'express';
import TreatmentImage from '../models/TreatmentImage.js';
import Patient from '../models/Patient.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { clinicFilter, withClinic } from '../middleware/clinicScope.js';

const MAX_IMAGE_LEN = 800000;

const router = express.Router({ mergeParams: true });

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const images = await TreatmentImage.find({ patient: req.params.patientId, ...clinicFilter(req) })
      .populate('treatment', 'name')
      .sort({ createdAt: -1 });
    res.json(images);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ _id: req.params.patientId, ...clinicFilter(req) });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const { beforeImage, afterImage } = req.body;
    if (beforeImage?.length > MAX_IMAGE_LEN || afterImage?.length > MAX_IMAGE_LEN) {
      return res.status(400).json({ message: 'Image too large (max ~600KB each)' });
    }

    const image = await TreatmentImage.create(
      withClinic(req, { ...req.body, patient: patient._id })
    );
    res.status(201).json(image);
  })
);

router.delete(
  '/:imageId',
  asyncHandler(async (req, res) => {
    const image = await TreatmentImage.findOneAndDelete({
      _id: req.params.imageId,
      patient: req.params.patientId,
      ...clinicFilter(req),
    });
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.json({ message: 'Image removed' });
  })
);

export default router;
