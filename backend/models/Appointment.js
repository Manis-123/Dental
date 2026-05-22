import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    treatment: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no_show'],
      default: 'scheduled',
    },
    notes: { type: String, trim: true },
    prescription: { type: String, trim: true },
    doctorNotes: { type: String, trim: true },
    reminderSentAt: { type: Date },
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);
