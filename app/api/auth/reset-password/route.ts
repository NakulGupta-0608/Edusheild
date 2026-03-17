import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Institute from "@/models/Institute";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, error: "Token and new password required" }, { status: 400 });
    }

    // Verify JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback_secret");
    } catch (err) {
      return NextResponse.json({ success: false, error: "Invalid or expired password reset token" }, { status: 401 });
    }

    const { identifier } = decoded;

    await dbConnect();

    // Find Institute by email or contact
    const institute = await Institute.findOne({
      $or: [
        { "ownerDetails.email": identifier },
        { "ownerDetails.contact": identifier }
      ]
    });

    if (!institute) {
      return NextResponse.json({ success: false, error: "No account found matching this identifier" }, { status: 404 });
    }

    // Hash the new password and save
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    institute.password = hashedPassword;
    await institute.save();

    return NextResponse.json({ success: true, message: "Password updated successfully." });

  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json({ success: false, error: "Failed to reset password" }, { status: 500 });
  }
}
