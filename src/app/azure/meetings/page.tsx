'use client'
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import _ from "lodash";
import { AzureMeetingConfig } from "./config/MeetingConfig";
import { AzureJoinMeeting } from "./join/JoinMeeting";
import CustomError from "@/app/lib/CustomError";

export default function AzureStartMeetingPage() {

    const getParams = useSearchParams();

    let participantIdentity = getParams.get("participant_identity");
    let participantToken = getParams.get("participant_token");
    let meetingId = getParams.get("meeting_id");
    let displayName = getParams.get("display_name");

    const [participantName, setParticipantName] = useState(displayName || "");

    return (
        <div className="w-screen h-screen">
            {
                participantIdentity && participantToken && meetingId ?
                    _.isEmpty(participantName) ?
                        (<AzureMeetingConfig setDisplayName={(val: string) => { setParticipantName(val) }} />)
                        : (<AzureJoinMeeting paricipantName={participantName} participantIdentity={participantIdentity} participantToken={participantToken} meetingId={meetingId} />)
                    : (<CustomError title="Meeting" description="Something went wrong" />)
            }
        </div>
    );
}