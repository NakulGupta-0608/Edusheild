import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/Institute';

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

    const instituteId = (session.user as any).instituteId;
    
    if (!instituteId) {
       return NextResponse.json(
        { success: false, error: 'Institute ID not found in session' },
        { status: 400 }
      );
    }

    const institute = await Institute.findOne({ instituteId });

    if (!institute) {
      return NextResponse.json(
        { success: false, error: 'Institute not found' },
        { status: 404 }
      );
    }

    // Format response safely
    const formattedInstitute = {
      id: institute._id.toString(),
      instituteId: institute.instituteId,
      name: institute.name,
      address: institute.address || {},
      capacity: institute.capacity || { maxAllowed: 0, currentlyEnrolled: 0 },
      infrastructure: institute.infrastructure || {},
      facilities: institute.facilities || {},
      riskStatus: institute.riskStatus,
      ownerDetails: institute.ownerDetails || {}
    };

    return NextResponse.json({ success: true, data: formattedInstitute });

  } catch (error: any) {
    console.error('Error fetching institute profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch institute profile' },
      { status: 500 }
    );
  }
}
