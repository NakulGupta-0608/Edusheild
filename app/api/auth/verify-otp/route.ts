import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Verification from "@/models/Verification";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { identifier, code, type } = await req.json();

    if (!identifier || !code || !type) {
      return NextResponse.json({ success: false, error: "Identifier, code, and type are required" }, { status: 400 });
    }

    await dbConnect();

    // Find the OTP record
    const record = await Verification.findOne({ identifier, code, type });

    if (!record) {
      return NextResponse.json({ success: false, error: "Invalid or expired verification code" }, { status: 400 });
    }

    // Delete the record after successful verification
    await Verification.deleteOne({ _id: record._id });

    if (type === "Password_Reset") {
      const token = jwt.sign(
        { identifier }, 
        process.env.NEXTAUTH_SECRET || "fallback_secret", 
        { expiresIn: "15m" }
      );
      return NextResponse.json({ 
        success: true, 
        message: "Verified successfully", 
        token 
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Verified successfully" 
    });

  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}
