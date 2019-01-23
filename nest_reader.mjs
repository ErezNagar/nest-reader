import http from 'http';
import constants from './constants.mjs';
import Thermostat from './thermostat.mjs';

const thermostat = new Thermostat();

const run = () => {
    thermostat.getThermostatData().then(data => {
        if (!data)
            return;

        thermostat.trackHVACStatus(data);
        thermostat.trackTemperatures(data);
    });
}

http.createServer().listen(process.env.PORT || 8818, () => {
    console.log(`Started Nest Reader in ${process.env.NODE_ENV} mode...`);
    setInterval(() => {
        run();
    }, constants.SAMPLE_INTERVAL);
});