import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true, default: () => `COMP-${Math.random().toString(36).substr(2, 9).toUpperCase()}` },
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' }, // Optional if complainee doesn't know exact ID
  instituteNameText: { type: String }, // Used if strict ID mapping fails
  complainantType: { type: String, enum: ['STUDENT', 'PARENT', 'PUBLIC'], required: true },
  complainantName: { type: String }, // Can be anonymous
  complainantContact: { type: String },
  type: { type: String, enum: ['COMPLAINT', 'SUGGESTION'], required: true, default: 'COMPLAINT' },
  category: { 
    type: String, 
    enum: ['FIRE', 'OVERCROWDING', 'WATER', 'FACILITIES', 'SAFETY', 'OTHER'],
    required: true
  },
  description: { type: String, required: true },
  evidenceUrls: [{ type: String }],
  status: { type: String, enum: ['PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'], default: 'PENDING' },
  adminNotes: { type: String }
}, {
  timestamps: true
});

export default mongoose.models.Complaint || mongoose.model('Complaint', ComplaintSchema);
