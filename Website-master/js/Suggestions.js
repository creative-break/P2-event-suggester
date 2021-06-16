"use strict";

const forwardBtn = document.querySelector("#forward");
const swipeLeftMorning = document.querySelector("#swipeLeftMorning");
const swipeRightMorning = document.querySelector("#swipeRightMorning");
const swipeLeftAfternoon = document.querySelector("#swipeLeftAfternoon");
const swipeRightAfternoon = document.querySelector("#swipeRightAfternoon");
const swipeLeftEvening = document.querySelector("#swipeLeftEvening");
const swipeRightEvening = document.querySelector("#swipeRightEvening");
const notMorning = document.getElementById("morning");
const notAfternoon = document.getElementById("afternoon");
const notEvening = document.getElementById("evening");
// Gets arrangements from local storage
const morning = JSON.parse(localStorage.getItem("morning"));
const afternoon = JSON.parse(localStorage.getItem("afternoon"));
const evening = JSON.parse(localStorage.getItem("evening"));
// Gets no arrangement information txt from local storage
const noMorningMatch = JSON.parse(localStorage.getItem("noMorningMatch"));
const noAfternoonMatch = JSON.parse(localStorage.getItem("noAfternoonMatch"));
const noEveningMatch = JSON.parse(localStorage.getItem("noEveningMatch"));
const morningTime = "Morning";
const afternoonTime = "Afternoon";
const eveningTime = "Evening";
let arrangementMorningNR = 0;
let arrangementAfternoonNR = 0;
let arrangementEveningNR = 0;
let dateAndTime = "";
let time = "";
const DIRECTION = {
    left: 0,
    right: 1
};
// Makes sure that the left and right variables can't be changed
Object.freeze(DIRECTION);

/*
 * FUNCTION: showWelcomeTxt
 * PURPOSE: Adds a welcome txt to the Suggestions.html file
 * PARAMETERS: none
 * RETURNS: none
 */
let showWelcomeTxt = () => {
    document.getElementById("h2Welcome").innerHTML = "Du har valgt følgende arrangementer";
    document.getElementById("h3Welcome").innerHTML = "Vær opmærksom på at vi ikke yder billetsalg og at du derfor skal købe eventuelle billetter direkte hos arrangøren";
};

/*
 * FUNCTION: hideButtonsAndCheckboxes
 * PURPOSE: Hides swipe buttons, <videre> button, and checkboxes, and then calls the function showWelcomTxt
 * PARAMETERS: none
 * RETURNS: none
 */
let hideButtonsAndCheckboxes = () => {
    document.getElementById("swipeRightMorning").style.display = "none";
    document.getElementById("swipeLeftMorning").style.display = "none";
    document.getElementById("swipeRightAfternoon").style.display = "none";
    document.getElementById("swipeLeftAfternoon").style.display = "none";
    document.getElementById("swipeRightEvening").style.display = "none";
    document.getElementById("swipeLeftEvening").style.display = "none";
    document.getElementById("forward").style.display = "none";
    document.querySelector(".notEvening").style.display = "none";
    document.querySelector(".notMorning").style.display = "none";
    document.querySelector(".notAfternoon").style.display = "none";
    showWelcomeTxt();
};

/*
 * FUNCTION: hideArrangementBox
 * PURPOSE: Hides arrangement box in suggestions.html file
 * PARAMETERS: timeperiod(input)
 * RETURNS: none
 */
let hideArrangementBox = (timeperiod) => {
    document.getElementById("section" + timeperiod).style.display = "none";
    document.getElementById("h3" + timeperiod).style.display = "none";
    document.querySelector(".not" + timeperiod).style.display = "none";
};

/*
 * FUNCTION: showDescription
 * PURPOSE: Shows arrangement description in suggestions.html file
 * PARAMETERS: timeperiod(input)
 * RETURNS: none
 */
let showDescription = (timeperiod) => {
    if (document.getElementById("section" + timeperiod).style.display != "none") {
        document.getElementById("text" + timeperiod).style.display = "block";
    }
};

/*
 * FUNCTION: insertArrangement
 * PURPOSE: adds arrangement data in suggestions.html file
 * PARAMETERS: timeperiod(input), dataArray(input), arrangement(input)
 * RETURNS: none
 */
let insertArrangement = (timeperiod, dataArray, arrangement) => {
    document.getElementById("title" + timeperiod).textContent = dataArray[arrangement].title;
    dateAndTime = dataArray[arrangement].event_datetime.split("T");
    document.getElementById("date" + timeperiod).textContent = "Dato: " + dateAndTime[0];
    time = dateAndTime[1].split(".");
    document.getElementById("time" + timeperiod).textContent = "Tidspunkt: " + time[0];
    document.getElementById("location" + timeperiod).textContent = "Lokation: " + dataArray[arrangement].address + ", " + dataArray[arrangement].postcode + " " + dataArray[arrangement].city + ", " + dataArray[arrangement].country;
    if (dataArray[arrangement].price > 0) {
        document.getElementById("price" + timeperiod).textContent = "Pris: " + dataArray[arrangement].price + " kr";
    } else if (dataArray[arrangement].price < 0) {
        document.getElementById("price" + timeperiod).textContent = "Pris: Ikke oplyst";
    } else {
        document.getElementById("price" + timeperiod).textContent = "Pris: GRATIS";
    }
    document.getElementById("category" + timeperiod).textContent = "Kategori: " + dataArray[arrangement].type;
    if (dataArray[arrangement].duration > 0) {
        document.getElementById("duration" + timeperiod).textContent = "Varighed: " + dataArray[arrangement].duration + " min";
    } else {
        document.getElementById("duration" + timeperiod).textContent = "Varighed: Ikke oplyst";
    }
    document.getElementById("img" + timeperiod).style.backgroundImage = "url(https://" + dataArray[arrangement].image_source + ")";
    document.getElementById("description" + timeperiod).textContent = dataArray[arrangement].description;
    document.getElementById("siteName" + timeperiod).href = "https://" + dataArray[arrangement].source;
};

/*
 * FUNCTION: checkIfNoMatch
 * PURPOSE: Checks if there are any arrangements. If not, then adds a txt in suggestions.html file and calls hideArrangementBox. If there are arrangements, then calls insertArrangement
 * PARAMETERS: noMatch(input), dataArray(input), timeperiod(input), arrangementNR(input)
 * RETURNS: none
 */
let checkIfNoMatch = (noMatch, dataArray, timeperiod, arrangementNR) => {
    if (noMatch !== "") {
        // Adds a txt in the html file, with information to the user
        document.getElementById("errorNoArrangement").innerHTML = noMatch;
        document.getElementById("errorNoArrangement").style.color = "red";
        hideArrangementBox(timeperiod);
    } else {
        insertArrangement(timeperiod, dataArray, arrangementNR);
    }
};

/*
 * FUNCTION: swipe
 * PURPOSE: shows the next or the previous arrangement
 * PARAMETERS: timeperiod(input), arrangementNR(input/output), dataArray(input), direction(input)
 * RETURNS: arrangementNR
 */
let swipe = (timeperiod, arrangementNR, dataArray, direction) => {
    const oldArrangementNr = arrangementNR;

    switch (direction) {
        case DIRECTION.left:
            {
                arrangementNR = arrangementNR - 1;
                if (arrangementNR < 0) {
                    arrangementNR = dataArray.length - 1;
                }
                break;
            }
        case DIRECTION.right:
            {
                arrangementNR = (arrangementNR + 1) % dataArray.length;
                break;
            }
        default:
            {
                arrangementNR = 0;
                break;
            }
    }
    insertArrangement(timeperiod, dataArray, arrangementNR);

    return arrangementNR;
};

swipeLeftMorning.addEventListener("click", function() {
    arrangementMorningNR = swipe(morningTime, arrangementMorningNR, morning, DIRECTION.left);
});
swipeLeftAfternoon.addEventListener("click", function() {
    arrangementAfternoonNR = swipe(afternoonTime, arrangementAfternoonNR, afternoon, DIRECTION.left);
});
swipeLeftEvening.addEventListener("click", function() {
    arrangementEveningNR = swipe(eveningTime, arrangementEveningNR, evening, DIRECTION.left);
});
swipeRightMorning.addEventListener("click", function() {
    arrangementMorningNR = swipe(morningTime, arrangementMorningNR, morning, DIRECTION.right);
});
swipeRightAfternoon.addEventListener("click", function() {
    arrangementAfternoonNR = swipe(afternoonTime, arrangementAfternoonNR, afternoon, DIRECTION.right);
});
swipeRightEvening.addEventListener("click", function() {
    arrangementEveningNR = swipe(eveningTime, arrangementEveningNR, evening, DIRECTION.right);
});

/*
 * FUNCTION: topOfPage
 * PURPOSE: Scrolls to the top of the page
 * PARAMETERS: none
 * RETURNS: none
 */
let topOfPage = () => {
    document.body.scrollTop = 0; // safari browser
    document.documentElement.scrollTop = 0; // chrome, firefox, IE, Opera
};

/*
 * FUNCTION: notChosenTimeperiod
 * PURPOSE: Checks if the user has chosen not to see any arrangement in a timeperiod (morning, afternoon or evening)
 * PARAMETERS: none
 * RETURNS: none
 */
let notChosenTimeperiod = () => {
    // Checks if the user has chosen not to see any arrangements in the morning
    if (notMorning.checked || document.getElementById("sectionMorning").style.display == "none") {
        hideArrangementBox(morningTime);
    } else {
        showDescription(morningTime);
    }

    // Checks if the user has chosen not to see any arrangements in the afternoon
    if (notAfternoon.checked || document.getElementById("sectionAfternoon").style.display == "none") {
        hideArrangementBox(afternoonTime);
    } else {
        showDescription(afternoonTime);
    }

    // Checks if the user has chosen not to see any arrangements in the evening
    if (notEvening.checked || document.getElementById("sectionEvening").style.display == "none") {
        hideArrangementBox(eveningTime);
    } else {
        showDescription(eveningTime);
    }

    // Checks if the user has chosen not to see any arrangements and gives an alert
    if (notMorning.checked && notEvening.checked && notAfternoon.checked) {
        alert("UPS! Du har fravalgt alle arrangementer.")
        document.getElementById("errorNoArrangement").innerHTML = "Du har ikke valgt nogen arrangementer. Foretag venligst en ny søgning, for at få vist arrangement foreslag!";
        document.getElementById("errorNoArrangement").style.color = "red";
    }
    hideButtonsAndCheckboxes();
    topOfPage();
};

// calls the function checkIfNoMatch on window load
window.onload = checkIfNoMatch(noMorningMatch, morning, morningTime, arrangementMorningNR), checkIfNoMatch(noAfternoonMatch, afternoon, afternoonTime, arrangementAfternoonNR), checkIfNoMatch(noEveningMatch, evening, eveningTime, arrangementEveningNR);

// Calls the function notChosenTimeperiod when the user has clicked on the button <videre>
forwardBtn.addEventListener("click", notChosenTimeperiod);