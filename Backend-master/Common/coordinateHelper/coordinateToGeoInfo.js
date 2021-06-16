// JavaScript source code
let https = require("https");

const server = "https://dawa.aws.dk/";


async function resolveCoordinatesInRadius(longitude, latitude, radiusInMeters) {

    let result = await webRequest(undefined, server, "postnumre?cirkel=${longitude},${latitude},${radiusInMeters}");
    console.log(result);


}

function webRequest(header, hostName, path) {
    let options = {
        headers: header,
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
    resolveCoordinatesInRadius,
}