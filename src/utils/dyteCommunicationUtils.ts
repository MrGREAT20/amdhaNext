
import axios from 'axios';
import { Constants } from './constants';
import _ from 'lodash';

export class DyteCommunicationUtils {

    private static instance: DyteCommunicationUtils;

    private basePath: string;

    meetings: DyteMeetingClient;

    private constructor(basePath: string) {
        this.basePath = basePath;
        let authHeader = `Basic ${Buffer.from(`${Constants.DYTE_CREDS.ORG_ID}:${Constants.DYTE_CREDS.API_KEY}`).toString('base64')}`;
        this.meetings = new DyteMeetingClient(this.basePath, authHeader);
    }

    public static getInstance(): DyteCommunicationUtils {
        if (!DyteCommunicationUtils.instance) {
            DyteCommunicationUtils.instance = new DyteCommunicationUtils(Constants.URLS.DYTE_API_BASE_PATH)
        }
        return DyteCommunicationUtils.instance
    }
}


class DyteMeetingClient {
    private basePath:string;
    private authHeader:string;

    constructor(basePath:string, authHeader: string){
        this.basePath = `${basePath}/meetings`;
        this.authHeader = authHeader;
    }

    async createMeeting(data: any) {
        let resp = await axios.post(`${this.basePath}`, data, { headers: {Authorization: this.authHeader} })

        if(!_.get(resp.data, "success")) throw `Failed ${resp.data}`

        return resp.data["data"];
    }

    async updateMeeting(meetingId:string, data: any) {
        data = data || {}
        
        let resp = await axios.patch(`${this.basePath}/${meetingId}`, data, { headers: {Authorization: this.authHeader} })
        
        if(!_.get(resp.data, "success")) throw `Failed ${resp.data}`
        
        return resp.data["data"];
    }

    async generateTokens(meetingId:string, data: any){
        const resp = await axios.post<any>(`${this.basePath}/${meetingId}/participants`, data , { headers: {Authorization: this.authHeader} });
        if(!_.get(resp.data, "success")) throw `Failed ${resp.data}`
        return resp.data["data"];
    }
}