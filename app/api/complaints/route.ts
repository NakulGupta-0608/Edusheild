import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Complaint from '@/models/Complaint';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const { 
      type, // 'COMPLAINT' or 'SUGGESTION'
      complainantType, 
      complainantName, 
      complainantContact, 
      instituteNameText, 
      category, 
      description 
    } = body;

    // Validate
    if (!type || !complainantType || !category || !description || !instituteNameText) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Default complaint ID
    const complaintId = (type === 'SUGGESTION' ? 'SUGG-' : 'COMP-') + Math.random().toString(36).substr(2, 9).toUpperCase();

    const newComplaint = new Complaint({
      complaintId,
      type,
      complainantType,
      complainantName: complainantName || 'Anonymous',
      complainantContact,
      instituteNameText,
      category,
      description,
      status: 'PENDING'
    });

    await newComplaint.save();

    return NextResponse.json({ success: true, data: { complaintId } }, { status: 201 });

  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit' },
      { status: 500 }
    );
  }
}
