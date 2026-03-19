import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/Institute';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { 
      name, 
      ownerDetails, 
      address, 
      infrastructure, 
      facilities,
      safetyCertificates,
      undertakings,
      capacity 
    } = body;

    // ✅ Full validation including student email
    if (!name || !ownerDetails || !ownerDetails.name || !ownerDetails.email || !ownerDetails.contact || !ownerDetails.studentEmail || !address || !capacity) {
      return NextResponse.json(
        { success: false, error: 'Mandatory fields are missing. Please fill all required fields.' },
        { status: 400 }
      );
    }

    // ✅ Validate 10-digit phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(ownerDetails.contact)) {
      return NextResponse.json(
        { success: false, error: 'Contact number must be exactly 10 digits.' },
        { status: 400 }
      );
    }

    // 1. Generate random secure ID and Password
    const newId = `INS-${Math.floor(1000 + Math.random() * 9000)}`;
    const plainPassword = Math.random().toString(36).slice(-8).toUpperCase();
    
    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    
    // 3. ✅ Save all data including uploaded URLs to MongoDB
    const newInstitute = new Institute({
      instituteId: newId,
      name,
      password: hashedPassword,
      ownerDetails: {
        name: ownerDetails.name,
        contact: ownerDetails.contact,
        email: ownerDetails.email,
        studentEmail: ownerDetails.studentEmail, // ✅ student email saved
        aadhaarPan: ownerDetails.aadhaarPan,
        photoUrl: ownerDetails.photoUrl || '',   // ✅ owner photo URL saved
      },
      address,
      infrastructure,
      facilities: {
        ...facilities,
        facilityPhotos: facilities?.facilityPhotos || [], // ✅ facility photo URLs saved
      },
      safetyCertificates: safetyCertificates?.map((cert: any) => ({
        type: cert.type,
        url: cert.url || '',  // ✅ certificate URLs saved
        aiVerificationStatus: 'Pending'
      })) || [],
      undertakings,
      capacity
    });

    await newInstitute.save();

    // 4. ✅ Return plain credentials immediately
    return NextResponse.json({ 
      success: true, 
      message: "Registration successful! Save your credentials carefully.",
      data: {
        instituteId: newId,
        plainPassword: plainPassword,
      } 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A duplicate institute ID was generated. Please try again.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to register institute. Please try again.' },
      { status: 500 }
    );
  }
}