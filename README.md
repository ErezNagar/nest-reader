# Nest Thermostat Reader

Currently, the Nest API only provides realtime data, not historical, while the app and the device only expose data from the last 10 days. This is a simple Nest data reader that aggregates my energy usage over a long period of time to look for patterns.

It collects data from my own Nest Thermostat I have installed at home and logs it into a Firebase NoSQL database. Every hour, it reads the humidity and tempareture (C and F) in my home, together with the 'Eco mode' status. In addition, it also reads the outside temperature and humidity using Open Weather Map's API, for a simple reference. It then persists this data to the Firebase database.

MIT Licensed.

* v1.3.1 Caching lastStatus to prevent hitting the DB every time.
* v1.3: Fixed humidity type error. Changed outside temperature F property to temperature_f.
* v1.2: Disabled tracking of C° temperatures.
* v1.1: Added tracking for thermostat hvac status.