import { generateDyteTokensForMeeting } from "@/helpers/tokenHelper";
import { Constants } from "@/utils/constants";
import _ from "lodash";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        let body = await req.json();
        const meetingId: string = _.get(body, "meeting_id"); //meetingId
        const participantPreset: string = _.get(body, "preset") || Constants.DYTE_MEETING_ROLES.PARTICIPANT;
        const participantName: string = _.get(body, "participant_name");
        const participantId: string = _.get(body, "participant_id");

        let result = await generateDyteTokensForMeeting(meetingId, { preset: participantPreset, participantId, name: participantName })

        return NextResponse.json({
            dyte_participant_id: result.dyteParticipantId,
            token: result.token,
            participant_id: result.participantId
          }, { status: 200 })

    } catch (e) {
        console.log(`Error ${req.method} @dyteTokens : get ${JSON.stringify(e)}`);
        return NextResponse.json({ message: `Something went wrong` }, { status: 500 });
    }
}
