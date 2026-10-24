import mongoose, { Schema } from 'mongoose';

const claimSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  claimant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date }
}, { timestamps: true });
claimSchema.index({ item: 1, claimant: 1 }, { unique: true });
export default mongoose.model('Claim', claimSchema);
