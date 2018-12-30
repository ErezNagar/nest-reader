# Nest Thermostat Reader

This is a simple Nest data reader. It collects data from my own Nest Thermostat I have installed at home and logs it into a Firebase NoSQL database.

Every hour, it reads the humidity and tempareture (C and F) in my home, together with the 'Eco mode' status (indicating wether or not I'm saving energy). In addition, it also reads the outside temperature and humidity using Open Weather Map's API, for a simple reference. It then persists this data the the Firebase database.

As it collects more data, I'll be able to look back (as much as I need) and draw the trends of my Nest Thermostat usage.

MIT Licensed.