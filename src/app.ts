import * as Axios from 'axios';
import * as qs from 'querystring';

import * as CONFIG from './config';

class WakaTimeBase {

    constructor() { }

    async getToken() {
        try {
            
            const requestObj = {
                client_id: CONFIG.CLIENT_ID,
                client_secret: CONFIG.CLIENT_SECRET,
                grant_type: CONFIG.GRANT_TYPE,
                refresh_token: CONFIG.REFRESH_TOKEN,
                redirect_uri: CONFIG.REDIRECT_URI
            }

            const headers = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }

            const responseObj = await Axios.default.post(CONFIG.WAKATIME_TOKEN_ENDPOINT, qs.stringify(requestObj), headers);

            console.log(responseObj.data)

        }
        catch (e) {
            console.log(e.response.data)
        }
    }


}

const wakaTime = new WakaTimeBase();

wakaTime.getToken();



export {
    WakaTimeBase
}