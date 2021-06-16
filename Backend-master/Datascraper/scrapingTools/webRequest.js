let https = require("https");

/*
 * FUNCTION: webRequest
 * PURPOSE: To GET an HTML page
 * PARAMETERS: header, hostName, path
 * RETURNS: A promise
 */
function webRequest(header, hostName, path) {
    let options = {
        method: 'GET',
        headers: header,
        host: hostName,
        path: path,
    };

    let p = new Promise((resolve, reject) => {

        let req = https.request(options, function(res) {
            let data = "";
            res.setEncoding("utf8");

            res.on("data", function (chunk) {
                data += chunk;
            });

            res.on("end", ()=> {
                resolve({ statuscode: res.statusCode, data: data});
            });

            res.on('error', (err) => {
                reject({statuscode: res.statusCode, data: err});
            });
        });
        req.end();
    });
    return p;
}

module.exports = {
    webRequest
}