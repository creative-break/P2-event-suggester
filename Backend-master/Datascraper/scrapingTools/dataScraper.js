/*
 * FUNCTION: dataScraper
 * PURPOSE: call the different scrapers
 * PARAMETERS: none
 * RETURNS: nothing
 */

const scraper = require('./getBilletlugen.js');
const upload = require('../DAL/pushData.js');

async function dataScraper() {
    let data = await scraper.getBilletlugen(); //call first scraper
    //console.log(data[0]);
    
    for (let i = 0; i < data.length; i++) { //loop every found event

        //console.log(data[i].remove_event);
        
        if (data[i].remove_event === true) { //check if the event needs to be skiped (if it contains errors or is missing sertain informations)
            console.log('event_Skipped');
        } else {
            try { //chect for errors in upload to database
                await upload.pushData(data[i]); //call pushdata to upload event
                console.log('pushed to DB sucessfully');
            }
            catch(ex) { //catch for upload errors
                console.log(ex);
            }
        }
    }
};

module.exports = {
    dataScraper
};