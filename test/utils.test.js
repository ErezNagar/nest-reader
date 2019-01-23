import node_fetch from 'node-fetch';
global.fetch = node_fetch;
import utils from '../utils.mjs';
import '@babel/polyfill';

describe('Utilities', () => {
    it('getOutsideWeather() should return temperature and humidity', async () => {
        const response = await utils.getOutsideWeather();
        expect(response).toEqual(jasmine.objectContaining({
            temperature_f: expect.any(Number),
            humidity: expect.any(Number),
          }));
    });

    it('kelvinToF() should convert Kelvin to Fahrenheit', () => {
        const tempInK = 280;
        const tempInF =  utils.kelvinToF(tempInK);
        expect(tempInF).toBeCloseTo(44.3, 1);
    });
})