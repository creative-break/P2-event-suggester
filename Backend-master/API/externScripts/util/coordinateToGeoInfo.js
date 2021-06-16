// JavaScript source code
let https = require("https");

const server = "dawa.aws.dk";

/*
 * FUNCTION: resolveCoordinatesInRadiusToPostCodes
 * PURPOSE: get postcodes within a area
 * PARAMETERS: longitude, latitude, radiusInMeters
 * RETURNS: promise --> resolve([postcodes])
 */
async function resolveCoordinatesInRadiusToPostCodes(longitude, latitude, radiusInMeters) {
    let returnList = [];

    let result = await webRequest(server, "/postnumre?cirkel=" + longitude + "," + latitude + "," + radiusInMeters);

    if (result.statuscode === 200) {
        result = JSON.parse(result.data);
        for (let i = 0; i < result.length; i++) {
            returnList.push(result[i].nr);
        }
    }

    return returnList;
}

/*
 * FUNCTION: webRequest
 * PURPOSE: handles http webrequest - this is copy from datascraper!
 * PARAMETERS: hostName, path
 * RETURNS: promise --> resolve(object: http statuscode, respond body data)
 */
function webRequest(hostName, path) {
    let options = {
        host: hostName,
        path: path,
        port: 443        // http = 80, https = 443, ftp = 21
    };

    let p = new Promise((resolve, reject) => {

        let req = https.request(options, function (res) {
            let data = "";
            res.setEncoding("utf8");

            res.on("data", function (chunk) {
                data += chunk;
            });

            res.on("end", () => {
                resolve({ statuscode: res.statusCode, data: data });
            });

            res.on('error', (err) => {
                reject({ statuscode: res.statusCode, data: err });
            });
        });
        req.end();
    });

    return p;
}

module.exports = {
    resolveCoordinatesInRadiusToPostCodes,
}