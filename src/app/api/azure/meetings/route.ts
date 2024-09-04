import { createAzureMeeting } from "@/helpers/meetingHelper";
import { NextRequest, NextResponse } from "next/server";
 
export async function POST(req: NextRequest) {
 
    try {
        
        let body = await req.json();

        let resp = await createAzureMeeting(body);

        return NextResponse.json(resp, { status: 200 });
    
    } catch (e) {
        console.log(`Error ${req.method} @azureMeetings : get ${JSON.stringify(e)}`);
        return NextResponse.json({ message: `Something went wrong` }, { status: 500 });
    }
}