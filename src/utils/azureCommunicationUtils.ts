import { CommunicationIdentityClient, TokenScope } from '@azure/communication-identity';
import { RoomsClient, CreateRoomOptions, CommunicationRoom } from '@azure/communication-rooms';
import { Constants } from './constants';


export class AzureCommunicationUtils {

    private static instance: AzureCommunicationUtils;

    private connectionString: string;

    roomsClient: RoomsClient
    communicationIdentityClient: CommunicationIdentityClient

    private constructor(connectionString: string) {
        this.connectionString = connectionString;
        this.roomsClient = new RoomsClient(this.connectionString);
        this.communicationIdentityClient = new CommunicationIdentityClient(this.connectionString);
    }

    public static getInstance(): AzureCommunicationUtils {
        if (!AzureCommunicationUtils.instance) {
            AzureCommunicationUtils.instance = new AzureCommunicationUtils(Constants.URLS.ACS_CONNECTION_STRING)
        }
        return AzureCommunicationUtils.instance
    }

    async createRoom(opts?: CreateRoomOptions): Promise<CommunicationRoom> {
        return await this.roomsClient.createRoom(opts);
    }

    async createIdentity(scope?: TokenScope[]) {
        scope = scope ? scope : ['chat', 'voip'];
        const result = await this.communicationIdentityClient.createUserAndToken(scope);
        return {
            identity: result.user.communicationUserId,
            token: result.token,
            expiresOn: result.expiresOn
        }
    }

}