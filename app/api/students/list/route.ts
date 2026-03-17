import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/Institute';
import Student from '@/models/Student';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== 'INSTITUTE') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const instituteIdStr = (session.user as any).instituteId;
    
    // Fetch institute to get ObjectId
    const institute = await Institute.findOne({ instituteId: instituteIdStr });
    if (!institute) {
      return NextResponse.json({ success: false, error: 'Institute not found' }, { status: 404 });
    }

    // Get all students for this institute
    const students = await Student.find({ instituteId: institute._id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: students }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}
