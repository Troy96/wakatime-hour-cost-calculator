import nodemailer from 'nodemailer';
import * as config from '../config';

class Mailer {

    private _transporter: nodemailer.Transporter;

    constructor() {
        this._transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: false,
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
            html: body
        }
        return new Promise<void>((resolve, reject) => {
            this._transporter.sendMail(options, (err, info) => {
                console.log(err.message, info)
                if (err) {
                    
                    reject(err.message);
                }
                resolve(info.response);
            })
        })
    }
}

export {
    Mailer
}