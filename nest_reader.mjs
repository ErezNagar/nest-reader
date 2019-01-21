import node_fetch from 'node-fetch';
global.fetch = node_fetch;
import http from 'http';
import wretch from 'wretch';
import DAO from './dao.mjs';
import constants from './constants.mjs';

const thermostatDAO = new DAO();

const run = () => {
    getThermostatData().then(data => {
        if (!data)
            return;

        trackHVACStatus(data);
        trackTemperatures(data);
    });
}

/*
 *  Makes a network request to the thermostat API to get the device data.
 *  @return {number} The device data.
*/
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

/*
 *  Saves the current HVAC (heating, ventilation, and air conditioning) status when it changes
 *  @param {object} data    the device data.
*/
const trackHVACStatus = data => {
    thermostatDAO.read("lastStatus")
        .then(lastStatus => {
            if (data.hvac_state !== lastStatus){
                updateLastThermostatStatus(data.hvac_state);
                saveThermostatStatus(data.hvac_state);
            }
        }).catch(error => {
            console.log("error", error);
        });
}

/*
 *  Saves the device temperature data every full hour, together with the outside temperature data
 *  @param {object} data    the device data.
*/
const trackTemperatures = data => {
    // Track temperatures every full hour
    if (new Date().getMinutes() !== 0)
        return;

    const date = new Date(Date.now()).toLocaleString();
    const thermostatData = {
        // in percent (%) format, measured at the device, rounded to the nearest 5%.
        humidity: data.humidity,
        has_leaf: data.has_leaf,
        temperature_f: data.target_temperature_f,
        ambient_temperature_f: data.ambient_temperature_f
    }

    getOutsideWeather()
        .then(weatherData => {
            return weatherData;
        })
        .then((weatherData) => {
            saveThermostatData({
                date: date,
                outside_weather: weatherData,
                nest: thermostatData
            });
        });
}

/*
 *  Gets the outside temperature data using the OpenWeatherMap API
 *  @return {number} The outside temperature data.
*/
const getOutsideWeather = () => {
    return wretch(constants.WEATHER_API_URL)
        .get()
        .json(res => {
            const temp = res.main.temp;
            const tempInC = temp - 273.15;
            const tempInF = tempInC * 1.8 + 32
            return {
                temperature_f: Math.round(tempInF * 10) / 10,
                humidity: res.main.humidity
            }
        })
        .catch(error => {
            console.log(`error getOutsideWeather(): ${error}`);
            return null;
        })
}

/*
 *  Updates the thermostat HVAC status flag in the DB.
 *  @param {string} status    the new status value to save.
*/
const updateLastThermostatStatus = status => {
    console.log("Updating last thermostat status...");
    thermostatDAO.update(status, 'lastStatus');
}

/*
 *  Persists the thermostat HVAC status to the DB.
 *  @param {string} status    the status to save.
*/
const saveThermostatStatus = status => {
    console.log("Saving thermostat status...");
    thermostatDAO.write({
        date: new Date(Date.now()).toLocaleString(),
        thermostatStatus: status
    });
}

/*
 *  Persists the data to the DB.
 *  @param {object} data    the data to save.
*/
const saveThermostatData = data => {
    console.log("Saving thermostat data...");
    thermostatDAO.write(data);
}

http.createServer().listen(process.env.PORT || 8818, () => {
    console.log("Started...");
    setInterval(() => {
        run();
    }, constants.SAMPLE_INTERVAL);
});