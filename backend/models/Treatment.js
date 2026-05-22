import mongoose from 'mongoose';

const treatmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, min: 15 }, // minutes
    category: {
      type: String,
      enum: ['cleaning', 'filling', 'root_canal', 'extraction', 'whitening', 'orthodontics', 'other'],
      default: 'other',
    },
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
  },
  { timestamps: true }
);

export default mongoose.model('Treatment', treatmentSchema);
