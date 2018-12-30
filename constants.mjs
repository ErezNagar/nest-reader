import auth from "./auth.mjs";

const CITY_ID = 4954380;
const WEATHER_API_APP_ID = '299923ca11830593e9a967d0baebe671';

export default {
    NEST_AUTH_TOKEN: process.env.NODE_ENV === 'production'? process.env.NEST_AUTH_TOKEN : auth.NEST_AUTH_TOKEN,
    FIREBASE_API_KEY: process.env.NODE_ENV === 'production'? process.env.FIREBASE_API_KEY : auth.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: 'nest-cfc9f.firebaseapp.com',
    FIREBASE_DB_URL: 'https://nest-cfc9f.firebaseio.com',
    NEST_API_URL: 'https://developer-api.nest.com',
    DEVICE_NAME: '743iDJfdnbMJlB4mVsa8ooyk___AL8Jo',
    WEATHER_API_URL: `http://api.openweathermap.org/data/2.5/weather?id=${CITY_ID}&APPID=${WEATHER_API_APP_ID}`,
    SAMPLE_INTERVAL: 3600 * 1000 // 1 hour;
}