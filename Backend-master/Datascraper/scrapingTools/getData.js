const request = require('./WebRequest.js');
const util = require('../util/delay');

/*
 * FUNCTION: getData
 * PURPOSE: Collect data from a given host and subURL
 * PARAMETERS: header, hostName, subURL
 * RETURNS: A promise 
 */
function getData(header,hostName,subURL) {

    let index = 0;
    
    //console.log("1");
    let p = new Promise(async (resolve, reject) => {
        let data = [];
        for (index = 0; index < subURL.length; index++) {
            try {
                
                result = await request.webRequest(header, hostName, subURL[index]);
                console.log(result.statuscode);

                if(result.statuscode === 200) {
                    data.push(result.data);
                }

                if(index !== subURL.length) {   // Creates a delay between request for 2 to four seconds to "humanize" the requests
                    let t = await randomNumber();
                    await util.delay(t);
                    //console.log("waited");
                }
            } catch(err) {
                console.log(err);
                reject(err);
            }
            //console.log("2");
        };
        //console.log("3");
        resolve(data);
    });
    //console.log("4");
    return p;
};

module.exports = {
    getData
}

/*
 * FUNCTION: randomNumber
 * PURPOSE: Create a number between 2 and four seconds
 * PARAMETERS: none
 * RETURNS: A number
 */
function randomNumber() {
    return new Promise((resolve) => {
        resolve(Math.random() * 2000 + 2000);
    });
}