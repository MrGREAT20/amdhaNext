const AZURE_ROOM_ROLES = {
    PRESENTER: "Presenter",
    ATTENDEE: "Attendee",
    CONSUMER: "Consumer"
};

const DYTE_MEETING_ROLES= {
    HOST : "AMDHA_HOST",
    PARTICIPANT : "AMDHA_PARTICIPANT"
}
const URLS = {
    ACS_CONNECTION_STRING: process.env.ACS_CONNECTION_STRING || "endpoint=https://video-calling-demo-acs.india.communication.azure.com/;accesskey=4wpOE4qZhc1X4hSNafztMe6CIMvCiuJJVZ5lHSOEVUm8Q41Nb3uFJQQJ99AHACULyCpJ2y7lAAAAAZCSSumU",
    DYTE_API_BASE_PATH : process.env.DYTE_API_BASE_PATH || "https://api.cluster.dyte.in/v2"
}

const DYTE_CREDS = {
    API_KEY : process.env.API_KEY || "f3032eec8d44d1ab24a4",
    ORG_ID : process.env.ORG_ID || "ef228c73-c60f-4616-a452-089543a6eb89"
}

export const Constants = {
    AZURE_ROOM_ROLES,
    URLS,
    DYTE_CREDS,
    DYTE_MEETING_ROLES
}