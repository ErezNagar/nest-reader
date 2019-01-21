import firebase from 'firebase';
import constants from './constants.mjs';

export default class DAO {
    constructor() {
        firebase.initializeApp({
            apiKey: constants.FIREBASE_API_KEY,
            authDomain: constants.FIREBASE_AUTH_DOMAIN,
            databaseURL: constants.FIREBASE_DB_URL
        });
    }

    read(path){
        return new Promise((resolve, reject) => {
            firebase.database().ref(path).once('value')
            .then(snapshot =>  {
                resolve(snapshot.val());
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    write(data) {
        const nodeRef = firebase.database().ref('data').push();
        nodeRef.set(data, error => {
            if (error) {
                console.log("Error persisting data", error);
            } else {
                console.log(`Successfully persisted data`);
            }
        });
    }

    update(data, path) {
        firebase.database().ref().update({[path]: data}, error => {
            if (error) {
                console.log("Error updating data", error);
            } else {
                console.log(`Successfully updateed data`);
            }
          });
    }
}