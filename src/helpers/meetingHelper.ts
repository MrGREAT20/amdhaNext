import { AzureCommunicationUtils } from "@/utils/azureCommunicationUtils";
import { Constants } from "@/utils/constants";
import { DyteCommunicationUtils } from "@/utils/dyteCommunicationUtils";
import _ from "lodash";

export async function createAzureMeeting(data: {start?: string, end?: string, role?: string}){
    data.role = data.role && _.values(Constants.AZURE_ROOM_ROLES).includes(data.role) ? data.role : Constants.AZURE_ROOM_ROLES.PRESENTER

    const validFrom = data.start ? new Date(data.start) : new Date();
    const validUntil = data.end ? new Date(data.end) : new Date(validFrom.getTime() + 24 * 60 * 60 * 1000);

    const room = await AzureCommunicationUtils.getInstance().createRoom({
        validFrom,
        validUntil
    });

    return {
        meeting_id: room.id,
        created_on: room.createdOn,
        valid_from: room.validFrom,
        valid_until: room.validUntil
    }
}

export async function createDyteMeeting(data: any){
    
    data = data  || {}
    data["title"] = data["title"] || "Default Meeting"

    let meetingData = await DyteCommunicationUtils.getInstance().meetings.createMeeting(data);

    return {
        meetingId: meetingData["id"],
        createdOn: meetingData["created_at"],
        status: meetingData["status"]
    }
}

export async function deactivateDyteMeeting(meetingId:string){
    let data = { status: "INACTIVE" }
    let meetingData = await DyteCommunicationUtils.getInstance().meetings.updateMeeting(meetingId, data);
    return {
        meeting_id: meetingData["id"],
        created_on: meetingData["created_at"],
        status: meetingData["status"]
    }
}