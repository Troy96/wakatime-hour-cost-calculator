import * as Axios from 'axios';
import * as qs from 'querystring';
import moment, { Moment } from 'moment';
import * as Cron from 'node-schedule';


import * as CONFIG from './config';
import { Token } from './classes/token';
import { Project } from './classes/project';
import { Mailer } from './alerts/mailer';

const mailer = new Mailer()


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

    get currentDate() {
        return this.now.format('YYYY-MM-DD');
    }

    get costForHours() {
        return this.totalHours * Number(CONFIG.COSTPERHOUR);
    }

    async generateReport() {
        try {
            console.log('>FETCHING REPORT...');

            const durationData: Project[] = await this.getDurationsByProject(CONFIG.PROJECT_NAME, this.currentDate);
            this.calculateTimeDurationForDay(durationData);
            const content = `<html>
                            <p>Hey, this is Wakatime Bot!,</p>
                            <br/>
                            <p>Total durations for the project <b>${CONFIG.PROJECT_NAME}</b> : <b>${this.totalHours.toFixed(1)}</b>
                            <p>Equivalent cost is <b>${this.totalHours.toFixed(1)}</b> * <b>${CONFIG.COSTPERHOUR}</b> = <b>${this.costForHours.toFixed(1)}</b></p>
        
                            </html>`;
            const resp = await mailer.sendMail(CONFIG.MAILERUSERNAME, 'Wakatime Project Cost Report', content);
            console.log('> REPORT SENT:', resp)
        } catch (e) {
            console.log('Some error', e);
        }
    }

    async initialize() {
        await this.getToken(CONFIG.REFRESH_TOKEN);
        setInterval(() => {
            this.getToken(this.refreshToken);
        }, 10000)

        Cron.scheduleJob(CONFIG.CRONPATTERN, () => {
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