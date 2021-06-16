"use strict";

const SERVER = "https://sw2b2-14.p2datsw.cs.aau.dk/node1";
//const SERVER = "http://localhost:3141";
let status = 0;

/*
 * FUNCTION: sendHttpRequest
 * PURPOSE: to send a request to the api (by the use of fetch and return the response
 * PARAMETERS: url (input), options (input). Options is headers, method and maybe a body (depending on the method)
 * RETURNS: returns the response from fetch (response from the API)
 */
let sendHttpsRequest = (url, options) => {
    // Fetch returns a promise ( resolved or reject depending on HTTP was succesfull)
    return fetch(url, options)
        // This function is called when the promise is resolved
        .then(response => {
            status = response.status;
            // Checks if the HTTP status code is between 200-299
            if (response.ok) {
                console.log("OK");
                // Parses JSON respons into a JS object
                return response.json();
            } else {
                console.log("Fejl");
                return response.json().then(errorResponseData => {
                    let error = new Error("Noget gik galt!");
                    error.data = errorResponseData;
                    throw error;
                });
            }
            // This function is called when the promise is rejected
        }).catch((err) => {
            console.log(err);
        });
};