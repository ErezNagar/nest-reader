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
        this.lastStatus = null;
    }

    /*
    *  Makes a network request to the thermostat API to get the device data.
    *  @return {number} The device data.
    */
    getThermostatData() {
        return new Promise((resolve, reject) => {
            wretch(constants.NEST_API_URL, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.auth
                }
            })
            .get()
            .json(res => res.devices.thermostats[constants.DEVICE_NAME])
            .catch(error => console.log(`Error getting thermostat data: ${error}`));
        });
    }

    /*
    *  Saves the current HVAC (heating, ventilation, and air conditioning) status when it changes
    *  @param {object} data    the device data.
    */
    trackHVACStatus(data) {
        this.getLastStatus()
            .then(lastStatus => {
                if (data.hvac_state !== lastStatus){
                    this.saveLastThermostatStatus(data.hvac_state);
                    this.saveThermostatStatus(data.hvac_state);
                }
            })
            .catch(error => console.log(`Error getting last status: ${error}`));
    }

    
    /*
    *  Gets the cached value of lastStatus. If cache is empty, fetches from DB and updates the cache with the new value
    *  @param {object} data    the device data.
    */
    getLastStatus() {
        return new Promise((resolve, reject) => {
            if (this.lastStatus)
                resolve(this.lastStatus);
            else{
                this.thermostatDAO.readLastStatus()
                    .then(lastStatus => {
                        console.log("lastStatus fetched from DB:", lastStatus);
                        this.lastStatus = lastStatus;
                        resolve(lastStatus);
                    })
                    .catch(error => reject(error));
            }
        })
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
    saveLastThermostatStatus(status) {
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