import { generateAzureTokens } from "@/helpers/tokenHelper";
import { NextRequest, NextResponse } from "next/server";
 
export async function GET(req: NextRequest) {
 
    try {
        let querParams = req.nextUrl.searchParams;
        let participantId: any = querParams.get("participant_id");
        let resp = await generateAzureTokens(participantId);
        return NextResponse.json(resp, { status: 200 })
    } catch (e) {
        console.log(`Error ${req.method} @azureTokens : get ${JSON.stringify(e)}`);
        return NextResponse.json({ message: `Something went wrong` }, { status: 500 });
    }
}