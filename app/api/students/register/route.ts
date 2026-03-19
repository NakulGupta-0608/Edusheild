import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/Institute';
import Student from '@/models/Student';

export async function POST(req: Request) {
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
    
    const institute = await Institute.findOne({ instituteId: instituteIdStr });
    if (!institute) {
      return NextResponse.json({ success: false, error: 'Institute not found' }, { status: 404 });
    }

    const { name, email, dob, qualification, course, guardianName, guardianContact, photoUrl } = await req.json();

    // ✅ Validate email is present
    if (!name || !email || !dob || !qualification || !course) {
      return NextResponse.json({ success: false, error: 'Missing required student details including email' }, { status: 400 });
    }

    // Capacity Check
    const { currentlyEnrolled, maxAllowed } = institute.capacity || { currentlyEnrolled: 0, maxAllowed: 0 };
    
    if (currentlyEnrolled >= maxAllowed && maxAllowed > 0) {
      return NextResponse.json(
        { success: false, error: `Capacity Exceeded: Your maximum allowed capacity is ${maxAllowed}. You cannot enroll more students.` },
        { status: 403 }
      );
    }

    // Generate Student ID
    const studentId = `STU-${Math.floor(10000 + Math.random() * 90000)}`;

    const newStudent = new Student({
      studentId,
      instituteId: institute._id,
      name,
      email,  // ✅ Save verified email to MongoDB
      age: calculateAge(new Date(dob)),
      qualification,
      courseEnrolled: course,
      photoUrl: photoUrl || '',
      guardianDetails: {
        name: guardianName,
        contact: guardianContact
      }
    });

    await newStudent.save();

    // Increment enrolled capacity
    institute.capacity.currentlyEnrolled = (institute.capacity.currentlyEnrolled || 0) + 1;
    await institute.save();

    return NextResponse.json({ success: true, data: { studentId } }, { status: 201 });

  } catch (error: any) {
    console.error('Student registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to enroll student' },
      { status: 500 }
    );
  }
}

function calculateAge(dob: Date) {
  const diffMs = Date.now() - dob.getTime();
  const ageDt = new Date(diffMs); 
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}