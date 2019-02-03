import firebase from 'firebase';
import constants from './constants.mjs';

/*
 *  Data Acces Layer interface with the Firebase real-time database.
 */
export default class DAO {
    constructor() {
        if (firebase.apps.length)
            return;

        firebase.initializeApp({
            apiKey: constants.FIREBASE_API_KEY,
            authDomain: constants.FIREBASE_AUTH_DOMAIN,
            databaseURL: constants.FIREBASE_DB_URL
        });
    }

    /*
    *  Read data from the database at the specified {location} node.
    *  @param {string} location    the path or node to read from.
    *  @return {object} Promise with the data when resolved, error otherwise.
    */
    _read(location = constants.LAST_STATUS_LOCATION) {
        return new Promise((resolve, reject) => {
            firebase.database().ref(location)
                .once('value')
                .then(snapshot =>  resolve(snapshot.val()))
                .catch(error => reject(error));
        });
    }

    /*
    *  Write data to the database at the specified {location} node.
    *  @param {object|string} data  the data to persist.
    *  @param {string} location     the location to write the data to.
    */
    _write(data, location = constants.DATA_LOCATION) {
        const nodeRef = firebase.database().ref(location).push();
        nodeRef.set(data, error => {
            if (error) {
                console.log("Error persisting data", error);
            } else {
                console.log(`Successfully persisted data`);
            }
        });
    }

    /*
    *  Update a value at the specified {location} node in the database.
    *  @param {object|string} data  the data to update the location with.
    *  @param {string} location     the location to update the data with.
    */
    _update(data, location = constants.LAST_STATUS_LOCATION) {
        firebase.database().ref().update({[location]: data}, error => {
            if (error) {
                console.log("Error updating data", error);
            } else {
                console.log(`Successfully updated data`);
            }
          });
    }

    /*
    *  Read the last status value from the database.
    *  @return {string} The value of the lmost recent status.
    */
    readLastStatus(){
        return this._read();
    }

    /*
    *  Write data to the database
    *  @param {object|string} data  the dhe data to persist.
    */
    write(data) {
        this._write(data);
    }

    /*
    *  Update the value of the last status
    *  @param {object|string} lastStatus  the new last status value to persist.
    */
    updateLastStatus(lastStatus) {
        this._update(lastStatus);
    }
}