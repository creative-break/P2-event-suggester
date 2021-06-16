/*
 * FUNCTION: app
 * PURPOSE: running our scraper at 2am
 * PARAMETERS: none
 * RETURNS: array of events
 */

process.on("uncaughtException", function (err) {
    console.error(err);
});

const scraper = require('./scrapingTools/dataScraper.js');
const util = require('./util/delay.js');

async function app() {

    while (true) {

        let date = new Date(); //create a new date
        if (date.getHours() === 02 && date.getMinutes() === 00) { //check if it's 2 am

            await scraper.dataScraper(); //run scrapers
        }
        await util.delay(60000); //delay so it checks the time every minute
    }
};

app(); //call to start the program