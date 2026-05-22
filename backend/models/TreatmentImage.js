import mongoose from 'mongoose';

const treatmentImageSchema = new mongoose.Schema(
  {
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    treatment: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    caption: { type: String, trim: true },
    beforeImage: { type: String },
    afterImage: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('TreatmentImage', treatmentImageSchema);
