import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
    name: { type: String, required: true, trim: true },
    sku: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    unit: { type: String, default: 'pcs', trim: true },
    minStock: { type: Number, default: 5, min: 0 },
    costPerUnit: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Inventory', inventorySchema);
