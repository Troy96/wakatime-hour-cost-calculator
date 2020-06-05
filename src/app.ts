import * as Axios from 'axios';
import * as qs from 'querystring';
import moment, { Moment } from 'moment';
import * as Cron from 'node-schedule';


import * as CONFIG from './config';
import { Token } from './classes/token';
import { Project } from './classes/project';
import { Slack } from './alerts/slack';

const slackAlert = new Slack();


class WakaTimeBase {

    private userId: string;
    private accessToken: string;
    private refreshToken: string;
    private totalHours: number = 0;
    private now: Moment = moment();

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
            console.log(respObj, 'fuhfgf')
            return respObj.data.data;
        } catch (e) {
            console.log(e.response.data)
        }
    }

    async calculateTimeDurationForDay(projectData: Project[]) {
        projectData.map(data => {
            this.totalHours += data.duration;
        })
        await Promise.all(projectData);
        this.totalHours = this.totalHours / 3600;
    }

    get currentDate() {
        return this.now.format('YYYY-MM-DD');
    }

    get costForHours() {
        return this.totalHours * Number(CONFIG.COSTPERHOUR);
    }

    async generateReport() {
        try {
            const projectList = ['india-clap-web', 'padhvaiya-backend'];

            projectList.forEach(async project => {
                const durationData: Project[] = await this.getDurationsByProject(project, this.currentDate);
                await this.calculateTimeDurationForDay(durationData);
                await slackAlert.sendAlert([{
                    title: `${project}: TOTAL HOURS`,
                    value: `Total durations for the project is ${this.totalHours.toFixed(1)} and Equivalent cost is ${this.totalHours.toFixed(1)} * ${CONFIG.COSTPERHOUR} = ${this.costForHours.toFixed(1)}`
                }]);
            })

        } catch (e) {
            console.log('Some error', e);
        }
    }

    async initialize() {
        await this.getToken(CONFIG.REFRESH_TOKEN);
        setInterval(() => {
            this.getToken(this.refreshToken);
        }, 60000)

        Cron.scheduleJob('55 21 * * *', () => {
            this.generateReport();
        });
    }

}


const wakaTime = new WakaTimeBase();
wakaTime.initialize();

//https://wakatime.com/oauth/authorize?client_id=csD1QReGD2NCp0ruY4dTgi2z&response_type=token&scope=email,write_logged_time,read_logged_time&redirect_uri=http://localhost:3000



export {
    WakaTimeBase
}