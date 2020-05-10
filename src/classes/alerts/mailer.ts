import nodemailer from 'nodemailer';
import * as config from './../../config';

class Mailer {

    private _transporter: nodemailer.Transporter;

    constructor() {
        this._transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.MAILERUSERNAME,
                pass: config.MAILERPASSWORD
            }
        })
    }

    sendMail(to, subject, body): Promise<void> {
        let options = {
            from: 'troy0870@gmail.com',
            to: to,
            subject: subject,
            text: body
        }
        return new Promise<void>((resolve, reject) => {
            this._transporter.sendMail(options, (err, info) => {
                if (err) {
                    reject(err.message);
                }
                resolve(info.response);
            })
        })
    }
}

export = {
    Mailer
}