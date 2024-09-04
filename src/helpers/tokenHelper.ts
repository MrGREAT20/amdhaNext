import { AzureCommunicationUtils } from "@/utils/azureCommunicationUtils";
import { DyteCommunicationUtils } from "@/utils/dyteCommunicationUtils";

export async function generateAzureTokens(participantId: string): Promise<{ identity: string, token: string, expiresOn: Date }> {

    if (participantId) {

        let { identity, token, expiresOn } = await AzureCommunicationUtils.getInstance().createIdentity();

        if (identity && token && expiresOn) {
            return {
                identity, token, expiresOn
            }
        } else throw `Invalid resp ${{ identity, token, expiresOn }}`
    } else throw `participantId required`

}

export async function generateDyteTokensForMeeting(meetingId: string, data: { preset: string, name: string, participantId: string }) {

    if (meetingId) {

        let { id, token, custom_participant_id } = await DyteCommunicationUtils.getInstance().meetings.generateTokens(meetingId, {
            preset_name : data.preset,
            custom_participant_id: data.participantId,
            name: data.name
        });
        return { dyteParticipantId: id, token, participantId: custom_participant_id }
    } else throw `meetingId required`

}