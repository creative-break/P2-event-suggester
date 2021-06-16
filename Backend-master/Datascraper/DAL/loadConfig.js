/*
 * FUNCTION: loadConfig
 * PURPOSE: Load a configuration fil for cleanData and getData
 * PARAMETERS: File name
 * RETURNS: Object with search and website info
 */

const fs = require('fs');
//const configPath = '../Datascraper/searchConfigs/billetlugenSearch.json';
const configPath = '../Datascraper/searchConfigs/';

function loadConfig(configFile) {

    let p = new Promise(async (resolve, reject) => {

        try { //check if the file was read properly
            fs.readFile(configPath + configFile, (err, data) => { //loads file and put it into string
                if (err) {
                    console.log(err);
                } else {
                    let config = JSON.parse(data); //converts string into Object
                    //console.log(config);
                    resolve(config);
                }
            });
        } catch (ex) { //catch to log errors
            console.log(ex);
            reject();
        }
    });
    return p;
};

//loadConfig();

module.exports = {
    loadConfig
}