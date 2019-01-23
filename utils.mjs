import wretch from 'wretch';
import constants from './constants.mjs';

/*
*  Converts temperature value from Kelvin to Fahrenheit
*  @param {number} temperature    the temperature value to convert in Kelvin.
*  @return {number} The outside temperature data.
*/
const kelvinToF = temperature => {
    const tempInC = temperature - 273.15;
    return tempInC * 1.8 + 32
}

/*
*  Gets the outside temperature data using the OpenWeatherMap API
*  @return {number} The outside temperature data.
*/
const getOutsideWeather = () => {
    return wretch(constants.WEATHER_API_URL)
        .get()
        .json(res => {
            const tempInF = kelvinToF(res.main.temp);
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

export default {
    kelvinToF,
    getOutsideWeather
}