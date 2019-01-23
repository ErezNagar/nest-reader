import Thermostat from '../src/thermostat.mjs';
import '@babel/polyfill';

describe('Thermostat', () => {
    it('Should not get device data using the wrong auth', async () => {
        const thermostat = new Thermostat("badAuth");
        const response = await thermostat.getThermostatData();
        // expect(await thermostat.getThermostatData()).rejects.toBeInstanceOf(Error);
        expect(JSON.parse(response.message).error).toBe("unauthorized");
    });

    it('Should get device data', async () => {
        const thermostat = new Thermostat();
        const response = await thermostat.getThermostatData();
        expect(response).toBeInstanceOf(Object);
    });

    it('Should get device data with properties', async () => {
        const thermostat = new Thermostat();
        const response = await thermostat.getThermostatData();
        expect(response).toEqual(jasmine.objectContaining({
            target_temperature_f: expect.any(Number),
            ambient_temperature_f: expect.any(Number),
            humidity: expect.any(Number),
            has_leaf: expect.any(Boolean)
          }));
    });
})