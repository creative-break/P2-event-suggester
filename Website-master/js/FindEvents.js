"use strict";

const seeArrangementsBtn = document.querySelector("#seeArrangements");
let chosenCategory = "";
let chosenCategorySplit = "";
//Gets the token from local storage
const token = JSON.parse(localStorage.getItem("token"));
let morningAllArrangements = [];
let afternoonAllArrangements = [];
let eveningAllArrangements = [];
let morning = [];
let afternoon = [];
let evening = [];
let noMorningMatch = "";
let noAfternoonMatch = "";
let noEveningMatch = "";
const noMatchText = "Det var desværre ikke muligt at finde arrangementer både formiddag, eftermiddag og aften. Prøv at foretage en ny søgning med en anden lokation eller kategori.";
let noArrangements = "";
let radius = 3000;
// Variabels used for the map
let marker;
let adress = "";
let adressSplit = "";
let addressLatLng = "";

/* OpenStreetMap - the code used for the map is borrowed from esri and is sligthly modified. Source: (https://esri.github.io/esri-leaflet/examples/geocoding-control.html) og (https://esri.github.io/esri-leaflet/examples/reverse-geocoding.html)*/

// Gets the map 
let map = L.map('map').setView([56.263920, 9.501785], 7); // MODIFICEDED: changed from var to let, coordinates are changed and zoom level
// Adds distance marking in left corner
L.control.scale().addTo(map);

// Adds "OpenStreetMap" to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let geocodeService = L.esri.Geocoding.geocodeService(); // MODIFIDED: changed from var to let

// Finds the address closest to where the user has clicked on the map
map.on('click', function(e) {
    geocodeService.reverse().latlng(e.latlng).run(function(error, result) {
        if (error) {
            return;
        }
        // Removes existing markers 
        if (marker) { //MODIFIDED: added if statement
            map.removeLayer(marker);
        }
        // Adds a marker where the user has clicked on the map
        marker = new L.marker(result.latlng).addTo(map).bindPopup(result.address.Match_addr).openPopup();
        // Saves the address
        adress = result.address.Match_addr;
        // Splits the address, so the different elements are accessible
        adressSplit = adress.split(",");
        // Saves the latitude og longitude of the address
        addressLatLng = result.latlng;
    });
});

// Gets geocoding control (makes seaching on the map possible) and adds it to the map
let searchControl = L.esri.Geocoding.geosearch().addTo(map); //MODIFIDED: changed from var to let

// Adds a marker to the map, when the user has picked a location from the search results 
searchControl.on('results', function(data) {
    for (var i = data.results.length - 1; i >= 0; i--) {
        if (marker) { // MODIFIDED: added if statement
            // Removes existing markers. So that only one marker (the latest) is present on the map
            map.removeLayer(marker);
        }
        // Adds a marker to the map. //MODIFIDED original code: results.addLayer(L.marker(data.results[i].latlng))
        marker = new L.marker(data.results[i].latlng).addTo(map).bindPopup(data.results[i].text).openPopup();
        // saves the address 
        adress = data.results[i].text;
        adressSplit = adress.split(",");
    }
    // Saves the latitude og longitude of the address
    addressLatLng = marker._latlng;
});
/* OpenStreetMap END*/

/*
 * FUNCTION: sortArrangements
 * PURPOSE: to save all the arrangement with the chosen category in a new array
 * PARAMETERS: chosenCategorySplit(input), dataArrayAll(input), dataArray(input/output)
 * RETURNS: none
 */
let sortArrangements = (chosenCategorySplit, dataArrayAll, dataArray) => {
    try {
        for (let arrangement = 0; arrangement < dataArrayAll.length; arrangement++) {
            for (let category = 0; category < chosenCategorySplit.length - 1; category++) {
                if (dataArrayAll[arrangement].type == chosenCategorySplit[category]) {
                    dataArray.push(dataArrayAll[arrangement]);
                }
                if (dataArrayAll[arrangement].price === 0 && chosenCategorySplit[category] == "Gratis") {
                    dataArray.push(dataArrayAll[arrangement]);
                }
            }
        };
    } catch (error) {
        console.log(error);
    }
};

/*
 * FUNCTION: sortByCategory
 * PURPOSE: to check if the user has chosen an categori and sort the arrangements according to the category
 * PARAMETERS: chosenCategory (input)
 * RETURNS: none
 */
let sortByCategory = (chosenCategory) => {
    chosenCategorySplit = chosenCategory.split(",");
    try {
        // If the variable chosenCategory is not empty (i.e. the user has chosen a category), the following function calls are made
        if (chosenCategory !== "") {
            // Calls the function sortArrangements, to sort the morning arrangements
            sortArrangements(chosenCategorySplit, morningAllArrangements, morning);
            // Calls the function sortArrangements, to sort the afternoon arrangements
            sortArrangements(chosenCategorySplit, afternoonAllArrangements, afternoon);
            // Calls the function sortArrangements, to sort the evening arrangements
            sortArrangements(chosenCategorySplit, eveningAllArrangements, evening);
        } else {
            // Makes sure that "all categories are chosen" (i.e. all arrangements in the chosen area, are chosen), if the user hasn't chosen a category
            morning = morningAllArrangements;
            afternoon = afternoonAllArrangements;
            evening = eveningAllArrangements;
        }
        if (morning.length === 0) {
            // If there are no arrangements in the morning, a information txt is saved
            noMorningMatch = noMatchText;
        };
        if (afternoon.length === 0) {
            // If there are no arrangements in the afternoon, a information txt is saved
            noAfternoonMatch = noMatchText;
        };
        if (evening.length === 0) {
            // If there are no arrangements in the evening, a information txt is saved
            noEveningMatch = noMatchText;
        };
        if (morning.length === 0 && afternoon.length === 0 && evening.length === 0) { // if all the arrays are empty, then a information txt is saved
            noArrangements = "Der er desværre ingen arrangementer i dette område som har følgende kategori: " + chosenCategorySplit + ". Prøv at foretag en ny søgning";
        }
    } catch (error) {
        console.log(error);
    }
};

/*
 * FUNCTION: saveData
 * PURPOSE: to save the arrangements arrays and the variables containing the no match txt, in local storage
 * PARAMETERS: none
 * RETURNS: none
 */
let saveData = () => {
    localStorage.setItem("morning", JSON.stringify(morning));
    localStorage.setItem("afternoon", JSON.stringify(afternoon));
    localStorage.setItem("evening", JSON.stringify(evening));
    localStorage.setItem("noMorningMatch", JSON.stringify(noMorningMatch));
    localStorage.setItem("noAfternoonMatch", JSON.stringify(noAfternoonMatch));
    localStorage.setItem("noEveningMatch", JSON.stringify(noEveningMatch));
};

/*
 * FUNCTION: getURL
 * PURPOSE: to get the right URL, depending on if the user has chosen an location or not
 * PARAMETERS: none
 * RETURNS: the URL as a string
 */
let getURL = () => {
    if (addressLatLng != "") {
        return SERVER + "/api/events/eventsWithinArea?longitude=" + addressLatLng.lng + "&latitude=" + addressLatLng.lat + "&radius=" + radius;
    } else {
        return SERVER + "/api/events/";
    }
};

/*
 * FUNCTION: getArrangementData
 * PURPOSE: to send a request to the api (by the use of sendHttpRequest) and if the response status is 200, calls sortByCategory, saveData and the changes the page
 * PARAMETERS: none
 * RETURNS: response from sendHttpRequest (i.e. the arrangements)
 */
let getArrangementData = () => {
    let method = "GET";
    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
    };
    let options = {
        headers: header,
        method: method,
    };
    try {
        sendHttpsRequest(getURL(), options)
            // This function is called when the promise is resolved
            .then((responseData) => {
                try {
                    console.log(responseData);
                    // Saves the arrangements in arrays
                    morningAllArrangements = responseData.beforenoon;
                    afternoonAllArrangements = responseData.afternoon;
                    eveningAllArrangements = responseData.evening;
                    console.log(status);
                    // Checks if the status is 200
                    if (status == 200) {
                        sortByCategory(chosenCategory);
                        saveData();
                        // If the variable noArrangements contains an empty string. It means that there is no arrangements, and the page is reloaded
                        if (noArrangements !== "") {
                            alert(noArrangements);
                            window.location.reload();
                        } else {
                            window.location.href = "./Suggestions.html";
                        }
                        // Checks if the status is above 399 (which indicates client errors (4xx) or server errors (5xx))
                    } else if (status > 399) {
                        alert("Noget gik galt, prøv igen!");
                    } else {
                        alert("Prøv igen!");
                    }
                } catch (err) {
                    console.log(err);
                }
                // This function is called when the promise is rejected
            }).catch((err) => {
                console.log(err, error.data);
            });
    } catch (err) {
        console.log(err);
    }
};

/*
 * FUNCTION: saveChosenCategory
 * PURPOSE: saves the chosen categories and calls the function getArrangementData
 * PARAMETERS: none. But takes the chosen categories from the FindEvents.html file
 * RETURNS: none
 */
let saveChosenCategory = () => {
    try {
        let category = document.forms[0];
        chosenCategory = "";
        for (let index = 0; index < category.length; index++) {
            if (category[index].checked) {
                chosenCategory += category[index].value + ",";
            }
        }
        getArrangementData();
    } catch (err) {
        console.log(err);
    }
};

// The function saveChosenCategory is call when the <se arrangementer> button is clicked
seeArrangementsBtn.addEventListener("click", saveChosenCategory);