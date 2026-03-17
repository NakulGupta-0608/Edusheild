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
      ownerName, 
      email, 
      contact, 
      address, 
      infrastructure, 
      facilities, 
      capacity 
    } = body;

    // Basic validation
    if (!name || !ownerName || !email || !contact || !address || !capacity) {
      return NextResponse.json(
        { success: false, error: 'Mandatory fields are missing' },
        { status: 400 }
      );
    }

    // 1. Generate random secure ID and Password
    const newId = `INS-${Math.floor(1000 + Math.random() * 9000)}`;
    const plainPassword = Math.random().toString(36).slice(-8);
    
    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    
    // 3. Save Institute record as 'PENDING_REGISTRATION' status
    const newInstitute = new Institute({
      instituteId: newId,
      name,
      password: hashedPassword,
      ownerDetails: {
        name: ownerName,
        email,
        contact
      },
      address,
      infrastructure,
      facilities,
      capacity
    });

    await newInstitute.save();

    // 4. Return plain credentials to admin
    return NextResponse.json({ 
      success: true, 
      data: {
        instituteId: newId,
        password: plainPassword
      } 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Check for duplicate key error mainly for instituteId (though random, technically possible)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A duplicate institute ID was generated. Please try again.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to register institute' },
      { status: 500 }
    );
  }
}
