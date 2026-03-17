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
    
    // Fetch institute to check capacity and get ObjectId
    const institute = await Institute.findOne({ instituteId: instituteIdStr });
    if (!institute) {
      return NextResponse.json({ success: false, error: 'Institute not found' }, { status: 404 });
    }

    const { name, dob, qualification, course, guardianName, guardianContact } = await req.json();

    if (!name || !dob || !qualification || !course) {
      return NextResponse.json({ success: false, error: 'Missing required student details' }, { status: 400 });
    }

    // Capacity Check
    const { currentlyEnrolled, maxAllowed } = institute.capacity || { currentlyEnrolled: 0, maxAllowed: 0 };
    
    if (currentlyEnrolled >= maxAllowed && maxAllowed > 0) {
      return NextResponse.json(
        { success: false, error: `Capacity Exceeded: Your maximum allowed capacity is ${maxAllowed}. You cannot enroll more students until capacity is expanded.` },
        { status: 403 } // Forbidden
      );
    }

    // Generate Student ID
    const studentId = `STU-${Math.floor(10000 + Math.random() * 90000)}`;

    const newStudent = new Student({
      studentId,
      instituteId: institute._id,
      name,
      // We will parse dob on frontend to check age, but let's just store DOB as age isn't directly on model or calculate roughly.
      // Wait, the schema has `age`, not `dob`. Let's calculate age.
      age: calculateAge(new Date(dob)),
      qualification,
      courseEnrolled: course,
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
