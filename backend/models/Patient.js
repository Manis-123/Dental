import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    age: { type: Number, min: 0 },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    address: { type: String, trim: true },
    medicalHistory: { type: String, trim: true },
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
  },
  { timestamps: true }
);

export default mongoose.model('Patient', patientSchema);
