import * as Axios from 'axios';
import * as qs from 'querystring';

import * as CONFIG from './config';
import { Token } from './classes/token';
import { Project } from './classes/project';


class WakaTimeBase {

    private userId: string;
    private accessToken: string;
    private refreshToken: string;
    private totalHours: number = 0;

    constructor() { }

    async getToken(refreshToken: string) {
        try {

            const requestObj = {
                client_id: CONFIG.CLIENT_ID,
                client_secret: CONFIG.CLIENT_SECRET,
                grant_type: CONFIG.GRANT_TYPE,
                refresh_token: refreshToken,
                redirect_uri: CONFIG.REDIRECT_URI
            }

            const headers = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }

            const responseObj = await Axios.default.post(CONFIG.WAKATIME_TOKEN_ENDPOINT, qs.stringify(requestObj), headers);

            const tokenObj: Token = responseObj.data;

            this.userId = tokenObj.uid;
            this.accessToken = tokenObj.access_token;
            this.refreshToken = tokenObj.refresh_token;

            console.log(this.refreshToken, this.accessToken)

        }
        catch (e) {
            console.log(e.response.data)
        }
    }

    async getDurations(date: string) {

        try {
            const respObj = await Axios.default.get(CONFIG.WAKATIME_BASE_ENDPOINT + 'users/' + this.userId + '/durations?date=' + date + '&access_token=' + this.accessToken);
            return respObj.data.data;
        } catch (e) {
            console.log(e.response.data)
        }
    }


    async getDurationsByProject(project: string, date: string) {
        try {
            const respObj = await Axios.default.get(CONFIG.WAKATIME_BASE_ENDPOINT + 'users/' + this.userId + '/durations?date=' + date + '&project=' + project + '&access_token=' + this.accessToken);
            return respObj.data.data;
        } catch (e) {
            console.log(e.response.data)
        }
    }

    async calculateTimeDurationForDay(projectData: Project[]) {
        projectData.map(data => {
            this.totalHours += data.duration;
        })
        this.totalHours = this.totalHours / 3600;
    }

    get costForHours(){
        return this.totalHours * Number(CONFIG.COSTPERHOUR);
    }

    async initialize() {
        await this.getToken(CONFIG.REFRESH_TOKEN);
        const durationData: Project[] = await this.getDurationsByProject(CONFIG.PROJECT_NAME, '2020-04-17');
        await this.calculateTimeDurationForDay(durationData);
        console.log(this.costForHours);
    }


}


const wakaTime = new WakaTimeBase();
wakaTime.initialize();

//https://wakatime.com/oauth/authorize?client_id=csD1QReGD2NCp0ruY4dTgi2z&response_type=token&scope=email,write_logged_time,read_logged_time&redirect_uri=http://localhost:3000



export {
    WakaTimeBase
}