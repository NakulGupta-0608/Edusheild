import mongoose, { Schema, Document, Model } from 'mongoose';

// ✅ TypeScript interface for Student
export interface IStudent extends Document {
  studentId: string;
  instituteId: mongoose.Schema.Types.ObjectId;
  name: string;
  age: number;
  email: string;
  photoUrl?: string;
  qualification: string;
  courseEnrolled: string;
  enrollmentDate: Date;
  guardianDetails: {
    name?: string;
    contact?: string;
  };
}

const StudentSchema = new Schema<IStudent>(
  {
    studentId: { type: String, required: true, unique: true },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    photoUrl: { type: String },
    qualification: { type: String, required: true },
    courseEnrolled: { type: String, required: true },
    enrollmentDate: { type: Date, default: Date.now },
    guardianDetails: {
      name: { type: String },
      contact: { type: String }
    }
  },
  {
    timestamps: true
  }
);

// ✅ Proper default export that TypeScript recognizes
const Student: Model<IStudent> =
  mongoose.models.Student
    ? (mongoose.models.Student as Model<IStudent>)
    : mongoose.model<IStudent>('Student', StudentSchema);

export default Student;