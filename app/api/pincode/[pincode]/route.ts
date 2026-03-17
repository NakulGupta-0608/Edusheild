import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ pincode: string }> }) {
  const { pincode } = await params;

  if (!/^\d{6}$/.test(pincode)) {
    return NextResponse.json({ success: false, error: "Invalid pincode" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      headers: {
        "Accept": "application/json",
      },
      cache: "no-store"
    });
    
    if (!res.ok) {
       return NextResponse.json({ success: false, error: "Failed to fetch pincode details" }, { status: res.status });
    }

    const data = await res.json();

    if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
      return NextResponse.json({ success: true, data: data[0].PostOffice[0] });
    } else {
      return NextResponse.json({ success: false, error: "No address found for this INC pincode" }, { status: 404 });
    }
  } catch (error) {
    console.error("Pincode API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch pincode details securely" }, { status: 500 });
  }
}
