"use strict";

const loginBtn = document.querySelector("#loginBtn");
const inputPassword = document.querySelector("#password");
/*
 * FUNCTION: sendLogin
 * PURPOSE: to send a request to the api (by the use of sendHttpRequest) and change the page if the response status is 200
 * PARAMETERS: none. But it takes username and password from the index.html file.
 * RETURNS: response from sendHttpRequest (i.e. token)
 */
let sendLogin = () => {
    try {
        let token = " ";
        let header = {
            "Content-Type": "application/json",
        };
        let body = {
            // Get the username and password from index.html file
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
        };
        let options = {
            headers: header,
            method: "POST",
            body: JSON.stringify(body),
        };
        sendHttpsRequest(SERVER + "/api/users/getToken/", options)
            // This function is called when the promise is resolved
            .then((responseData) => {
                try {
                    console.log(responseData);
                    // Saves the token in a variable
                    token = responseData.token;
                    saveToken(token);
                    console.log(status);
                    // Checks if the status is 200
                    if (status == 200) {
                        window.location.href = "./FindEvents.html";
                        // Checks if the status is above 399 (which indicates client errors (4xx) or server errors (5xx))
                    } else if (status > 399) {
                        alert("Forkert login. Prøv igen!");
                    }
                } catch (err) {
                    console.log(err);
                }
                // This function is called if the promise is rejected
            }).catch((err) => {
                console.log(err, error.data);
            });
    } catch (err) {
        console.log(err);
    }
};

/*
 * FUNCTION: saveToken
 * PURPOSE: to save token in local storage
 * PARAMETERS: the token
 * RETURNS: the token in local storage
 */
let saveToken = (token) => {
    return localStorage.setItem("token", JSON.stringify(token));
}

// Calls the function sendLogin when the <login> button is clicked or the user presses ENTER on the keyboard
loginBtn.addEventListener("click", sendLogin);
inputPassword.addEventListener("keyup", function(event) {
    console.log("keyup");
    //key 13 = ENTER
    if (event.keyCode === 13) {
        // Makes sure that default functionalities on the button ENTER does not run
        event.preventDefault();
        sendLogin();
        console.log("if");
    }
});