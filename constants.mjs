const CITY_ID = 4954380;

export default {
    NEST_AUTH_TOKEN: process.env.NEST_AUTH_TOKEN,
    NEST_API_URL: 'https://developer-api.nest.com',
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DB_URL: process.env.FIREBASE_DB_URL,
    DEVICE_NAME: '743iDJfdnbMJlB4mVsa8ooyk___AL8Jo',
    WEATHER_API_URL: `http://api.openweathermap.org/data/2.5/weather?id=${CITY_ID}&APPID=${process.env.WEATHER_API_APP_ID}`,
    SAMPLE_INTERVAL: 60000, // 1 minute;
    THERMOSTAT_OFF: "off",
}