import mongoose, { Schema } from 'mongoose';

const itemSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  type: { type: String, enum: ['LOST', 'FOUND'], required: true },
  category: { type: String, enum: ['Electronics', 'ID & Cards', 'Bags', 'Keys', 'Clothing', 'Books', 'Accessories', 'Other'], default: 'Other' },
  location: { type: String, required: true, trim: true, maxlength: 160 },
  dateOccurred: { type: Date, required: true },
  imageUrl: { type: String, default: '', trim: true },
  status: { type: String, enum: ['OPEN', 'CLAIM_PENDING', 'RESOLVED', 'ARCHIVED'], default: 'OPEN' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  contactHint: { type: String, default: '', maxlength: 160 }
}, { timestamps: true });
itemSchema.index({ title: 'text', description: 'text', location: 'text' });
export default mongoose.model('Item', itemSchema);
