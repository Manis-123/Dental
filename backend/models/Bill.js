import mongoose from 'mongoose';

const billItemSchema = new mongoose.Schema({
  treatment: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' },
  name: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
});

const billSchema = new mongoose.Schema(
  {
    billNumber: { type: String, unique: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    items: { type: [billItemSchema], required: true, validate: [(v) => v.length > 0, 'At least one item required'] },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
    paymentMethod: { type: String, enum: ['cash', 'card', 'online', ''], default: '' },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
  },
  { timestamps: true }
);

billSchema.pre('save', async function (next) {
  if (!this.billNumber) {
    const count = await mongoose.model('Bill').countDocuments();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    this.billNumber = `BILL-${date}-${String(count + 1).padStart(4, '0')}`;
  }
  if (this.paidAmount >= this.total) {
    this.status = 'paid';
  } else if (this.paidAmount > 0) {
    this.status = 'partial';
  } else {
    this.status = 'pending';
  }
  next();
});

export default mongoose.model('Bill', billSchema);
