'use client'
import { AzureCommunicationUtils } from "@/utils/azureCommunicationUtils";
import { ParticipantRole, RoomParticipant } from "@azure/communication-rooms";
import { useEffect, useState } from "react";

import CustomError from "@/app/lib/CustomError";
import { CommunicationUserIdentifier } from "@azure/communication-common";
import {
  CallAdapterLocator
} from '@azure/communication-react';
import { Call } from "../../lib/Call";


export interface AzureJoinMeetingProps {
  participantToken: string;
  participantIdentity: string;
  paricipantName: string;
  meetingId: string;
}

export function AzureJoinMeeting(props: AzureJoinMeetingProps) {



  let callAdaptorlocator: CallAdapterLocator = { roomId: props.meetingId }
  let azureIdentity: CommunicationUserIdentifier = { communicationUserId: props.participantIdentity }

  let [isError, setIsError] = useState(false);

  // init
  useEffect(() => {

    (async () => {
      try {
        await addUserToRoom(props.participantIdentity, props.meetingId);
      } catch (error) {
        console.log(`Error @Rooms : ${error}`);
        setIsError(true);
      }
    })();
  }, [])

  if (isError) {
    return (
      <CustomError title="Join Meeting" />
    )
  }

  return (
    <Call
      azureToken={props.participantToken}
      azureIdentity={{ communicationUserId: props.participantIdentity }}
      displayName={props.paricipantName}
      callLocator={{ roomId: props.meetingId }}
    />
  )
}


const addUserToRoom = async (participantIdentity: string, roomId: string): Promise<void> => {
  // AzureCommunicationUtils.getInstance().callAutomationClient.getCallRecording();
  const addParticipantsList: RoomParticipant[] = [
    {
      id: { kind: 'communicationUser', communicationUserId: participantIdentity },
      role: 'Presenter' as ParticipantRole
    }
  ];
  await AzureCommunicationUtils.getInstance().roomsClient.addOrUpdateParticipants(roomId, addParticipantsList);
};

