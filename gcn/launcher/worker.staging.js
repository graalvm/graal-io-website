const currentFetch = fetch;
const BASE_URL = "https://objectstorage.us-phoenix-1.oraclecloud.com/n/oraclelabs/b/gcn-js-files/o/SNAPSHOT%2F";

fetch = (url, ...args) => {
    if (url.endsWith("/worker.staging.js.bin")) {
        url = BASE_URL + 'cloud.graal.gcn.ui.api.js.bin';
    }
    return currentFetch(url, args);
}

importScripts(BASE_URL + 'cloud.graal.gcn.ui.api.js');
importScripts('worker.js');
