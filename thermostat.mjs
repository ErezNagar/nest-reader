import node_fetch from 'node-fetch';
global.fetch = node_fetch;
import wretch from 'wretch';
import constants from './constants.mjs';
import DAO from './dao.mjs';
import utils from './utils.mjs';

export default class Thermostat {
    constructor(auth = constants.NEST_AUTH_TOKEN){
        this.thermostatDAO = new DAO();
        this.auth = auth;
    }

    /*
    *  Makes a network request to the thermostat API to get the device data.
    *  @return {number} The device data.
    */
    getThermostatData() {
        return wretch(constants.NEST_API_URL, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.auth
            }
        })
        .get()
        .json(res => res.devices.thermostats[constants.DEVICE_NAME])
        .catch(error => {
            console.log(`error getThermostatData(): ${error}`);
            return error;
        })
    }

    /*
    *  Saves the current HVAC (heating, ventilation, and air conditioning) status when it changes
    *  @param {object} data    the device data.
    */
    trackHVACStatus(data) {
        this.thermostatDAO.readLastStatus()
            .then(lastStatus => {
                if (data.hvac_state !== lastStatus){
                    this.updateLastThermostatStatus(data.hvac_state);
                    this.saveThermostatStatus(data.hvac_state);
                }
            }).catch(error => {
                console.log("error", error);
            });
    }

    /*
    *  Saves the device temperature data every full hour, together with the outside temperature data
    *  @param {object} data    the device data.
    */
    trackTemperatures(data) {
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

        utils.getOutsideWeather()
            .then(weatherData => weatherData)
            .then((weatherData) => {
                this.saveThermostatData({
                    date: date,
                    outside_weather: weatherData,
                    nest: thermostatData
                });
            });
    }

    /*
    *  Updates the thermostat HVAC status flag in the DB.
    *  @param {string} status    the new status value to save.
    */
    updateLastThermostatStatus(status) {
        console.log("Updating last thermostat status...");
        this.thermostatDAO.updateLastStatus(status);
    }

    /*
    *  Persists the thermostat HVAC status to the DB.
    *  @param {string} status    the status to save.
    */
    saveThermostatStatus(status) {
        console.log("Saving thermostat status...");
        this.thermostatDAO.write({
            date: new Date(Date.now()).toLocaleString(),
            thermostatStatus: status
        });
    }

    /*
    *  Persists the data to the DB.
    *  @param {object} data    the data to save.
    */
    saveThermostatData(data) {
        console.log("Saving thermostat data...");
        this.thermostatDAO.write(data);
    }
}