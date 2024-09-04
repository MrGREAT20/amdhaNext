
import { createDyteMeeting, deactivateDyteMeeting } from "@/helpers/meetingHelper";
import { NextRequest, NextResponse } from "next/server";
 
export async function POST(req: NextRequest) {
 
    try {
        
        let body = await req.json();
        
        let resp = await createDyteMeeting(body);

        return NextResponse.json(resp, { status: 200 });
    
    } catch (e) {
        console.log(`Error ${req.method} @dyteMeetings : get ${JSON.stringify(e)}`);
        return NextResponse.json({ message: `Something went wrong` }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
 
    try {

        let querParams = req.nextUrl.searchParams;
        let meetingId = querParams.get("meeting_id");

        if(!meetingId) throw `meeting Id required`
        
        let resp = await deactivateDyteMeeting(meetingId);
        
        return NextResponse.json(resp, { status: 200 });
    
    } catch (e) {
        console.log(`Error ${req.method} @dyteMeetings : get ${JSON.stringify(e)}`);
        return NextResponse.json({ message: `Something went wrong` }, { status: 500 });
    }
}