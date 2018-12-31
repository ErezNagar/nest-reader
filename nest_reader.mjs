import node_fetch from 'node-fetch';
global.fetch = node_fetch;
import http from 'http';
import wretch from 'wretch';
import firebase from 'firebase';
import constants from './constants.mjs';

firebase.initializeApp({
    apiKey: constants.FIREBASE_API_KEY,
    authDomain: constants.FIREBASE_AUTH_DOMAIN,
    databaseURL: constants.FIREBASE_DB_URL
});

const persistData = data => {
    const dbNodeRef = firebase.database().ref('data').push();
    dbNodeRef.set(data, error => {
        if (error) {
            console.log("Error persisting data", error)
        } else {
            console.log(`Successfully persisted data - ${data.date} (ET)`)
        }
    });
}

const getOutSideWeather = () => {
    return wretch(constants.WEATHER_API_URL)
    .get()
    .json(res => {
        const temp = res.main.temp;
        const tempInC = temp - 273.15;
        const tempInF = tempInC * 1.8 + 32
        return {
            C: Math.round(tempInC * 10) / 10,
            F: Math.round(tempInF * 10) / 10,
            humidity: res.main.humidity
        }
    })
    .catch(error => {
        return error;
    })
}

const getNestData = () => {
    return wretch(constants.NEST_API_URL, {
        headers: { "Content-Type": "application/json", "Authorization": constants.NEST_AUTH_TOKEN, }
    })
    .get()
    .json(res => {
        // TODO: bulletproof this
        const data = res.devices.thermostats[constants.DEVICE_NAME];
        return {
            // in percent (%) format, measured at the device, rounded to the nearest 5%.
            humidy: data.humidity,
            has_leaf: data.has_leaf,
            temperature_c: data.target_temperature_c,
            temperature_f: data.target_temperature_f,
            temperature_c: data.ambient_temperature_c,
            temperature_f: data.ambient_temperature_f,
        }
    })
    .catch(error => {
        return error;
    })
}

const run = () => {
    Promise.all([getOutSideWeather(), getNestData()]).then(values => {
        const weather = values[0];
        const nest = values[1];
    
        const data = {
            date: new Date(Date.now()).toLocaleString(),
        };
    
        data.outside_weather = weather instanceof Error? {
            "error": JSON.parse(weather.message).cod,
            "message": JSON.parse(weather.message).message
        } : weather;
    
        data.nest = nest instanceof Error? {
            "error": JSON.parse(nest.message).error,
            "message": JSON.parse(nest.message).message
        } : nest;
    
        persistData(data);
    });
}


http.createServer().listen(process.env.PORT || 8818, () => {
    console.log("Started...");
    setInterval(() => {
        run();
    }, constants.SAMPLE_INTERVAL);
});