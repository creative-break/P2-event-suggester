'use strict';
process.title = "API";
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');

//Logs all uncaught exceptions
process.on("uncaughtException", function (err) {
    console.error(err);
});

//Logs if the application is stopped
process.on('exit', function (err) {
    console.log(err);
    console.log("Stopping app: " + process.title.toString());
});

//Setup CORS vaild sites.
const originSetting = ['http://localhost:3141',
    'https://sw2b2-14.p2datsw.cs.aau.dk'
]

//Create app(Webserver)
var app = express();

//Create routes to endpoint files
const users = require('./routes/users');
const events = require('./routes/events');

//Setup CORS, this should allow for multiple sites.
//source: https://www.npmjs.com/package/cors#configuring-cors-w-dynamic-origin
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        if (originSetting.indexOf(origin) === -1) {
            return callback(new Error("CORS policy missing"), false);
        }

        return callback(null, true);
    },
    exposedHeaders:['Content-Type', 'Authorization'],
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
}));

// view engine setup
app.enable("trust proxy");
app.use(logger(':remote-addr, :method, :url, :status, :date[web], :response-time ms'));
app.use(express.json()); //this enables express framework to handle JSON 
app.use(bodyParser.json()); //this parse body as JSON.

//Setup routes to endpoint
app.use('/api/users', users); //Setup URL route to user endpoints
app.use('/api/events', events); //Setup URL route to events endpoints

//set port for app to listen on
app.set('port', process.env.PORT || 3141); //check for environment port define otherwise 3141.

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port); //log that API has started on which port.
});


//create file stream for log and error files 
const sessions = fs.createWriteStream('./logs/node.access.log', { flags: 'a' });
const error = fs.createWriteStream('./logs/node.error.log', { flags: 'a' });

//redirct stdout(console) to file stream created above to log console.log and console.error to files
process.stdout.write = sessions.write.bind(sessions);
process.stderr.write = error.write.bind(error)
