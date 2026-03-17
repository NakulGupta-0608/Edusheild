import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/Institute';

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch all institutes
    // In a real application, you might want to only fetch verified institutes
    // or paginate the results, but for now we fetch all of them.
    const institutes = await Institute.find({}).sort({ registrationDate: -1 });

    // Map the database model to the format expected by the frontend
    const formattedInstitutes = institutes.map((institute) => ({
      // Map MongoDB _id to string as id, or use the generated instituteId
      id: institute.instituteId || institute._id.toString(),
      name: institute.name,
      // Format the location from the address object
      location: `${institute.address?.city || 'Unknown City'}, ${institute.address?.state || 'Unknown State'}`,
      // Map RiskStatus to front-end status/safe
      status: institute.riskStatus === 'SAFE' ? 'Verified' : 
              institute.riskStatus === 'WARNING' ? 'Warning' : 
              institute.riskStatus === 'UNSAFE' ? 'Unsafe' : 'Pending Verification',
      safe: institute.riskStatus === 'SAFE',
      // Format capacity string based on currentlyEnrolled/maxAllowed
      capacity: institute.capacity?.currentlyEnrolled >= institute.capacity?.maxAllowed && institute.capacity?.maxAllowed > 0 
                ? 'Full' : 'Available',
      // We don't have courses in the model currently, so we provide a placeholder
      courses: 'Various Courses',
      // Mock rating for now as it's not in the schema
      rating: 4.5,
      issue: institute.riskStatus !== 'SAFE' ? 'Compliance review needed' : undefined
    }));

    return NextResponse.json({ success: true, count: formattedInstitutes.length, data: formattedInstitutes });
  } catch (error: any) {
    console.error('Error fetching public institutes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch institutes' },
      { status: 500 }
    );
  }
}
