import mongoose from 'mongoose';

const InstituteSchema = new mongoose.Schema({
  instituteId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  ownerDetails: {
    name: { type: String },
    contact: { type: String },
    email: { type: String }
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  },
  infrastructure: {
    totalArea: { type: Number }, // in sq ft
    totalClassrooms: { type: Number },
    classroomDimensions: { type: String } // e.g., "20x30, 25x30"
  },
  facilities: {
    drinkingWater: { type: Boolean, default: false },
    separateToilets: { type: Boolean, default: false },
    cctvInstalled: { type: Boolean, default: false },
    firstAid: { type: Boolean, default: false }
  },
  safetyCertificates: [{
    url: { type: String },
    type: { type: String, enum: ['Fire', 'Building', 'Other'] },
    aiVerificationStatus: { type: String, enum: ['Pending', 'Verified', 'Failed'], default: 'Pending' }
  }],
  capacity: {
    maxAllowed: { type: Number, default: 0 },
    currentlyEnrolled: { type: Number, default: 0 }
  },
  riskStatus: {
    type: String,
    enum: ['SAFE', 'WARNING', 'UNSAFE', 'PENDING_REGISTRATION'],
    default: 'PENDING_REGISTRATION'
  },
  registrationDate: { type: Date, default: Date.now },
  expiryDate: { type: Date }
}, {
  timestamps: true
});

export default mongoose.models.Institute || mongoose.model('Institute', InstituteSchema);
