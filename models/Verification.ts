import mongoose from "mongoose";

const VerificationSchema = new mongoose.Schema(
  {
    identifier: {
      type: String, // Email or Phone Number
      required: true,
    },
    code: {
      type: String, // 6-digit OTP
      required: true,
    },
    type: {
      type: String,
      enum: ["Email_Verification", "Phone_Verification", "Password_Reset"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 1800, // 30 minutes TTL
    },
  },
  { timestamps: true }
);

export default mongoose.models.Verification ||
  mongoose.model("Verification", VerificationSchema);
