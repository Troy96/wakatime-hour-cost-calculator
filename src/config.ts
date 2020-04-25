const config = {
    WAKATIME_BASE_ENDPOINT: process.env.WAKATIME_BASE_ENDPOINT || '',
    REFRESH_TOKEN: process.env.REFRESH_TOKEN || '',
    GRANT_TYPE: process.env.GRANT_TYPE || '',
    REDIRECT_URI: process.env.REDIRECT_URI || '',
    CLIENT_ID: process.env.CLIENT_ID || '',
    CLIENT_SECRET: process.env.CLIENT_SECRET || ''
}

if (!config.WAKATIME_BASE_ENDPOINT) throw new Error('> WAKATIME_BASE_ENDPOINT NOT FOUND');
if (!config.REFRESH_TOKEN) throw new Error('> REFRESH_TOKEN NOT FOUND');
if (!config.REDIRECT_URI) throw new Error('> REDIRECT_URI NOT FOUND');
if (!config.GRANT_TYPE) throw new Error('> GRANT_TYPE NOT FOUND');
if (!config.CLIENT_ID) throw new Error('> CLIENT_ID NOT FOUND');
if (!config.CLIENT_SECRET) throw new Error('> CLIENT_SECRET NOT FOUND');


export = config;