import * as dotenv from 'dotenv';

dotenv.config();

const config = {
    WAKATIME_TOKEN_ENDPOINT: process.env.WAKATIME_TOKEN_ENDPOINT || '',
    WAKATIME_BASE_ENDPOINT: process.env.WAKATIME_BASE_ENDPOINT || '',
    REFRESH_TOKEN: process.env.REFRESH_TOKEN || '',
    GRANT_TYPE: process.env.GRANT_TYPE || '',
    REDIRECT_URI: process.env.REDIRECT_URI || '',
    CLIENT_ID: process.env.CLIENT_ID || '',
    CLIENT_SECRET: process.env.CLIENT_SECRET || '',
    PROJECT_NAME: process.env.PROJECT_NAME || '',
    COSTPERHOUR: process.env.COSTPERHOUR || '',
    MAILERUSERNAME: process.env.MAILERUSERNAME || '',
    MAILERPASSWORD: process.env.MAILERPASSWORD || '',
    CRONPATTERN: process.env.CRONPATTERN || ''
}

if (!config.WAKATIME_TOKEN_ENDPOINT) throw new Error('> WAKATIME_TOKEN_ENDPOINT NOT FOUND');
if (!config.WAKATIME_BASE_ENDPOINT) throw new Error('> WAKATIME_BASE_ENDPOINT NOT FOUND');
if (!config.REFRESH_TOKEN) throw new Error('> REFRESH_TOKEN NOT FOUND');
if (!config.REDIRECT_URI) throw new Error('> REDIRECT_URI NOT FOUND');
if (!config.GRANT_TYPE) throw new Error('> GRANT_TYPE NOT FOUND');
if (!config.CLIENT_ID) throw new Error('> CLIENT_ID NOT FOUND');
if (!config.CLIENT_SECRET) throw new Error('> CLIENT_SECRET NOT FOUND');
if (!config.PROJECT_NAME) throw new Error('> PROJECT_NAME NOT FOUND');
if (!config.COSTPERHOUR) throw new Error('> COSTPERHOUR NOT FOUND');
if (!config.MAILERUSERNAME) throw new Error('> MAILERUSERNAME NOT FOUND');
if (!config.MAILERPASSWORD) throw new Error('> MAILERPASSWORD NOT FOUND');
if (!config.CRONPATTERN) throw new Error('> CRONPATTERN NOT FOUND');


export = config;