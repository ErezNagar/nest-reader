const CITY_ID = 4954380;

const PRODUCTION_DATA_LOCATION = 'data';
const PRODUCTION_LAST_STATUS_LOCATION = 'lastStatus';
const DEVELOPMENT_DATA_LOCATION = 'dev-data';
const DEVELOPMENT_LAST_STATUS_LOCATION = 'dev-lastStatus';

export default {
    NEST_AUTH_TOKEN: process.env.NEST_AUTH_TOKEN,
    NEST_API_URL: 'https://developer-api.nest.com',
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DB_URL: process.env.FIREBASE_DB_URL,
    DEVICE_NAME: '743iDJfdnbMJlB4mVsa8ooyk___AL8Jo',
    WEATHER_API_URL: `http://api.openweathermap.org/data/2.5/weather?id=${CITY_ID}&APPID=${process.env.WEATHER_API_APP_ID}`,
    // 1 minute
    SAMPLE_INTERVAL: process.env.NODE_ENV === 'production' ?
        60000 : 5000,
    DATA_LOCATION: process.env.NODE_ENV === 'production' ?
        PRODUCTION_DATA_LOCATION : DEVELOPMENT_DATA_LOCATION,
    LAST_STATUS_LOCATION: process.env.NODE_ENV === 'production' ?
        PRODUCTION_LAST_STATUS_LOCATION : DEVELOPMENT_LAST_STATUS_LOCATION,
}