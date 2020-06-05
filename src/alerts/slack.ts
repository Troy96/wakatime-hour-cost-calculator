import * as request from 'request';

class Slack {
    constructor() { }

    async sendAlert(data) {

        const payload = {
            username: 'Tuhin Roy',
            channel: '#project',
            attachments: [{
                fallback: "Wakatime Alert!",
                pretext: "**New Wakatime Alert!**",
                text: "Wakatime Alert!",
                color: "success",
                fields: data
            }]
        }

        const body = {
            json: payload
        }

        const resp = await request.post(process.env.SLACKWEBHOOK, body);
        return resp.body;
    }
}

export {
    Slack
}