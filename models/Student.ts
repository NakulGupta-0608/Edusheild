import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  photoUrl: { type: String }, // User requested mock photo upload
  qualification: { type: String, required: true },
  courseEnrolled: { type: String, required: true },
  enrollmentDate: { type: Date, default: Date.now },
  guardianDetails: {
    name: { type: String },
    contact: { type: String }
  }
}, {
  timestamps: true
});

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
