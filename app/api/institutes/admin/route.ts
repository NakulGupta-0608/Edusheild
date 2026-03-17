import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/Institute';

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch all institutes for admin
    const institutes = await Institute.find({}).sort({ registrationDate: -1 });

    const formattedInstitutes = institutes.map((institute) => {
      // Calculate capacity percentage safely
      let capacityPercentage = 0;
      if (institute.capacity?.maxAllowed > 0) {
        capacityPercentage = Math.round((institute.capacity.currentlyEnrolled / institute.capacity.maxAllowed) * 100);
      } else if (institute.capacity?.currentlyEnrolled > 0) {
        // Edge case where they have students but no max allowed set yet
        capacityPercentage = 100;
      }

      return {
        id: institute._id.toString(),
        instituteId: institute.instituteId,
        name: institute.name,
        city: institute.address?.city || 'Unspecified',
        capacityPercentage,
        currentlyEnrolled: institute.capacity?.currentlyEnrolled || 0,
        maxAllowed: institute.capacity?.maxAllowed || 0,
        riskStatus: institute.riskStatus || 'PENDING_REGISTRATION',
      };
    });

    return NextResponse.json({ success: true, data: formattedInstitutes });
  } catch (error: any) {
    console.error('Error fetching admin institutes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch institutes' },
      { status: 500 }
    );
  }
}
