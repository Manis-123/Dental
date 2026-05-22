import mongoose from 'mongoose';

const reminderLogSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    patientPhone: { type: String, required: true },
    channel: { type: String, enum: ['sms', 'whatsapp', 'mock'], default: 'mock' },
    message: { type: String, required: true },
    status: { type: String, enum: ['sent', 'failed', 'mock'], default: 'mock' },
    error: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('ReminderLog', reminderLogSchema);
