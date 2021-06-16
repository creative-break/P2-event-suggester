/*
 * FUNCTION: getBilletlugen
 * PURPOSE: takes the subURL to all categoris from
            from www.billetlugen.dk for the next 30 days
            collecting the correct data and saves it as an object
 * PARAMETERS: none
 * RETURNS: array of events
 */

const request = require('./getData.js');
const loadConfig = require('../DAL/loadConfig.js');
const clean = require('./cleanData.js');
const missing = require('./handleMissingData.js');

const getBilletlugen = async () => {

    let tempData,
        finalData = [];
        
       
    let p = new Promise(async (resolve) => {

        let configFileName = 'billetlugenSearch.json';

        let config = await loadConfig.loadConfig(configFileName); //loading config for Billetlugen
        //console.log(config);
        //console.log(config.billetlugenHeader);

        let stringHTML = await request.getData(config.billetlugenHeader, config.hostName, config.subURL); //call to get HTML data from Billetlugen
        
        //console.log(stringHTML[0]);
        

        let eventData = await clean.cleanData(config, stringHTML); //call to get Event informations

        for (let i = 0; i < eventData.length; i++) {
            tempData = await missing.handleMissingData(eventData[i]); //call to make sure there is no missingdata or event gets skiped if there are missing data
            console.log(tempData);
            finalData[i] = tempData;
            //console.log(finalData);
        }
        resolve(finalData);
    });
    return p;
    //while (true);
};

module.exports = {
    getBilletlugen
};