import node_fetch from 'node-fetch';
global.fetch = node_fetch;
import http from 'http';
import wretch from 'wretch';
import DAO from './dao.mjs';
import constants from './constants.mjs';

const thermostatDAO = new DAO();

let lastThermostatStatus = constants.THERMOSTAT_OFF;

const run = () => {
    getThermostatData().then(data => {
        if (!data)
            return;

        // Track status change
        if (data.hvac_state !== lastThermostatStatus){
            lastThermostatStatus = data.hvac_state;
            saveThermostatStatus(lastThermostatStatus);
        }

        // Track temperatures every full hour
        if (new Date().getMinutes() !== 0)
            return;

        const date = new Date(Date.now()).toLocaleString();
        const thermostatData = {
            // in percent (%) format, measured at the device, rounded to the nearest 5%.
            humidy: data.humidity,
            has_leaf: data.has_leaf,

            // Disable tracking of C temperatures
            // temperature_c: data.target_temperature_c,
            temperature_f: data.target_temperature_f,
            // ambient_temperature_c: data.ambient_temperature_c,
            ambient_temperature_f: data.ambient_temperature_f
        }

        getOutsideWeather().then(weatherData => {
            if (!weatherData)
                return;

            saveThermostatData({
                date: date,
                outside_weather: weatherData,
                nest: thermostatData
            });
        });
    });
}

const getThermostatData = () => {
    return wretch(constants.NEST_API_URL, {
        headers: { "Content-Type": "application/json", "Authorization": constants.NEST_AUTH_TOKEN, }
    })
    .get()
    .json(res => {
        // TODO: bulletproof this
        return res.devices.thermostats[constants.DEVICE_NAME];
    })
    .catch(error => {
        console.log(`error getThermostatData(): ${error}`);
        return null;
    })
}

const getOutsideWeather = () => {
    return wretch(constants.WEATHER_API_URL)
        .get()
        .json(res => {
            const temp = res.main.temp;
            const tempInC = temp - 273.15;
            const tempInF = tempInC * 1.8 + 32
            return {
                // Disable tracking of C temperatures
                // C: Math.round(tempInC * 10) / 10,
                F: Math.round(tempInF * 10) / 10,
                humidity: res.main.humidity
            }
        })
        .catch(error => {
            console.log(`error getOutsideWeather(): ${error}`);
            return null;
        })
}

const saveThermostatStatus = (status) => {
    console.log("Saving thermostat status...");
    thermostatDAO.writeToDB({
        date: new Date(Date.now()).toLocaleString(),
        thermostatStatus: status
    });
}

const saveThermostatData = (data) => {
    console.log("Saving thermostat data...");
    thermostatDAO.writeToDB(data);
}

http.createServer().listen(process.env.PORT || 8818, () => {
    console.log("Started...");
    setInterval(() => {
        run();
    }, constants.SAMPLE_INTERVAL);
});