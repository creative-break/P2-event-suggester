/*
 * FUNCTION: cleanData
 * PURPOSE: Function to pick out the right elements from the scraped HTML and requests more if needed
 * PARAMETERS: Config object and string with HTML
 * RETURNS: Object with eventinfo
 */

const eventInfo = require('../prototypes/eventInfo.js');
const eventObject = require('../prototypes/eventObject.js');
const request = require('./getData.js');

async function cleanData(config, stringHTML) {

    //console.log(config.searchWords);

    let eventList = [], //needed arrays in cleanData
        sortedEventList = [],
        listOfEventHTML = [];

    let eventCounter = 0, //needed variables in cleanData
        startIndex = 0,
        exsistingEventIndex = 0,
        endOfEventIndex = 0,
        extraIndex = 0,
        startOfSearchIndex = 0,
        endOfSearchIndex = 0;

    let extraString = '/'; //needed strings in cleanData

    let p = new Promise(async (resolve, reject) => {

        try { //check for good input

            for (let i = 0; i < stringHTML.length; i++) {

                if (config.searchWords.falseEvent.exsist === true) { //using configfil to set a new search point if needed

                    for (let j = 0; j < config.searchWords.falseEvent.numberOfSkips; j++) {

                        startIndex = stringHTML[i].indexOf(config.searchWords.falseEvent.startSearch, startIndex) + config.searchWords.falseEvent.startSearch.length; //making the new point
                    }
                }

                exsistingEventIndex = stringHTML[i].indexOf(config.searchWords.newEvent.startSearch, startIndex); //look for the start of an event
                endOfEventIndex = stringHTML[i].indexOf(config.searchWords.newEvent.endSearch, exsistingEventIndex); //look for the end of an event

                while ((exsistingEventIndex !== -1) && (endOfEventIndex !== -1)) {

                    try { //check individual event for errors

                        eventList[eventCounter] = new eventInfo(); //create new event in an array

                        //Link
                        if (config.searchWords.eventLink.needExtraSearch === true) { //check if extra search point is needed
                            extraIndex = stringHTML[i].indexOf(config.searchWords.eventLink.extraSearch, exsistingEventIndex);
                        } else {
                            extraIndex = exsistingEventIndex;
                        }
                        startOfSearchIndex = stringHTML[i].indexOf(config.searchWords.eventLink.startSearch, extraIndex) + config.searchWords.eventLink.startSearch.length;
                        endOfSearchIndex = stringHTML[i].indexOf(config.searchWords.eventLink.endSearch, startOfSearchIndex);
                        eventList[eventCounter].link = stringHTML[i].substr(startOfSearchIndex, endOfSearchIndex - startOfSearchIndex); //saving event link
                        //console.log(eventList[eventCounter].link);

                        eventList[eventCounter].link = eventList[eventCounter].link.replace(/;/g, '&'); //fixing link
                        eventList[eventCounter].link = extraString.concat(eventList[eventCounter].link); //fixing link
                        listOfEventHTML = await request.getData(config.billetlugenHeader, config.hostName, [eventList[eventCounter].link]); //call to get HTML from event site
                        //console.log(listOfEventHTML[0]);

                        //Name (call to helpfunction to get info)
                        eventList[eventCounter].name = findValuesInHtmlDoc(stringHTML[i],
                            listOfEventHTML[0],
                            config.searchWords.eventName.startSearch,
                            config.searchWords.eventName.endSearch,
                            config.searchWords.eventName.extraSearch,
                            config.searchWords.eventName.needEventLink,
                            config.searchWords.eventName.needExtraSearch,
                            exsistingEventIndex);
                        //console.log(eventList[eventCounter].name);

                        //Venue (call to helpfunction to get info)
                        eventList[eventCounter].venue = findValuesInHtmlDoc(stringHTML[i],
                            listOfEventHTML[0],
                            config.searchWords.eventVenue.startSearch,
                            config.searchWords.eventVenue.endSearch,
                            config.searchWords.eventVenue.extraSearch,
                            config.searchWords.eventVenue.needEventLink,
                            config.searchWords.eventVenue.needExtraSearch,
                            exsistingEventIndex);
                        //console.log(eventList[eventCounter].venue);

                        //Location (call to helpfunction to get info)
                        eventList[eventCounter].location = findValuesInHtmlDoc(stringHTML[i],
                            listOfEventHTML[0],
                            config.searchWords.eventLocation.startSearch,
                            config.searchWords.eventLocation.endSearch,
                            config.searchWords.eventLocation.extraSearch,
                            config.searchWords.eventLocation.needEventLink,
                            config.searchWords.eventLocation.needExtraSearch,
                            exsistingEventIndex);
                        //console.log(eventList[eventCounter].location);

                        //Date (call to helpfunction to get info)
                        eventList[eventCounter].date = findValuesInHtmlDoc(stringHTML[i],
                            listOfEventHTML[0],
                            config.searchWords.eventDate.startSearch,
                            config.searchWords.eventDate.endSearch,
                            config.searchWords.eventDate.extraSearch,
                            config.searchWords.eventDate.needEventLink,
                            config.searchWords.eventDate.needExtraSearch,
                            exsistingEventIndex);
                        //console.log(eventList[eventCounter].date);

                        //Time (call to helpfunction to get info)
                        eventList[eventCounter].time = findValuesInHtmlDoc(stringHTML[i],
                            listOfEventHTML[0],
                            config.searchWords.eventTime.startSearch,
                            config.searchWords.eventTime.endSearch,
                            config.searchWords.eventTime.extraSearch,
                            config.searchWords.eventTime.needEventLink,
                            config.searchWords.eventTime.needExtraSearch,
                            exsistingEventIndex);
                        //console.log(eventList[eventCounter].time);

                        //Price (call to helpfunction to get info)
                        eventList[eventCounter].price = findValuesInHtmlDoc(stringHTML[i],
                            listOfEventHTML[0],
                            config.searchWords.eventPrice.startSearch,
                            config.searchWords.eventPrice.endSearch,
                            config.searchWords.eventPrice.extraSearch,
                            config.searchWords.eventPrice.needEventLink,
                            config.searchWords.eventPrice.needExtraSearch,
                            exsistingEventIndex);
                        //console.log(eventList[eventCounter].price);

                        //Image (call to helpfunction to get info)
                        eventList[eventCounter].image = findValuesInHtmlDoc(stringHTML[i],
                            listOfEventHTML[0],
                            config.searchWords.eventImage.startSearch,
                            config.searchWords.eventImage.endSearch,
                            config.searchWords.eventImage.extraSearch,
                            config.searchWords.eventImage.needEventLink,
                            config.searchWords.eventImage.needExtraSearch,
                            exsistingEventIndex);
                        //console.log(eventList[eventCounter].image);

                        //Description (call to helpfunction to get info)
                        eventList[eventCounter].description = findValuesInHtmlDoc(stringHTML[i],
                            listOfEventHTML[0],
                            config.searchWords.eventDescription.startSearch,
                            config.searchWords.eventDescription.endSearch,
                            config.searchWords.eventDescription.extraSearch,
                            config.searchWords.eventDescription.needEventLink,
                            config.searchWords.eventDescription.needExtraSearch,
                            exsistingEventIndex);
                        //console.log(eventList[eventCounter].description);

                        //category (setting category using our assinged FK-values)
                        if (i < 6) {
                            eventList[eventCounter].category = i + 1;
                        } else {
                            eventList[eventCounter].category = 8;
                        };

                        sortedEventList[eventCounter] = eventSorter(eventList[eventCounter], config); //call helpfunction to sort eventinfo to match the on needed in the database 
                        console.log(sortedEventList[eventCounter]);

                        //steps to check for more events and how many there have been found
                        eventCounter++;
                        //console.log(eventCounter);
                        exsistingEventIndex = stringHTML[i].indexOf(config.searchWords.newEvent.startSearch, endOfEventIndex + config.searchWords.newEvent.endSearch.length);
                        endOfEventIndex = stringHTML[i].indexOf(config.searchWords.newEvent.endSearch, exsistingEventIndex + config.searchWords.newEvent.startSearch.length);

                    } catch (ex) { //catch to drop a faulty event
                        console.log(ex);
                        exsistingEventIndex = stringHTML[i].indexOf(config.searchWords.newEvent.startSearch, endOfEventIndex + config.searchWords.newEvent.endSearch.length);
                        endOfEventIndex = stringHTML[i].indexOf(config.searchWords.newEvent.endSearch, exsistingEventIndex + config.searchWords.newEvent.startSearch.length);
                    };
                };
            };
        } catch (err) { //catch to drop bad input data
            console.log(err);
            reject(err);
        };
        resolve(sortedEventList);
    });
    return p;
};


/*
 * FUNCTION: findValueInHtmlDoc (helpfunction)
 * PURPOSE: Find a specifik event information
 * PARAMETERS: HTML strings + searchwords to search for
 * RETURNS: A event information
 */

function findValuesInHtmlDoc(htmlSite, htmlEvent, startValue, endValue, extraValue, eventLinkNeed, extraSearchNeeded, EventIndex) {
    let extraIndex = 0, startOfSearchIndex = 0, endOfSearchIndex = 0;

    if (!eventLinkNeed) { //check what string to use
        if (extraSearchNeeded) { //check if extra search point is needed
            extraIndex = htmlSite.indexOf(extraValue, EventIndex);
        } else {
            extraIndex = EventIndex;
        };
        startOfSearchIndex = htmlSite.indexOf(startValue, extraIndex) + startValue.length;
        endOfSearchIndex = htmlSite.indexOf(endValue, startOfSearchIndex);
        return htmlSite.substr(startOfSearchIndex, endOfSearchIndex - startOfSearchIndex); //return the found information
    } else {
        if (extraSearchNeeded) { //check if extra search point is needed
            extraIndex = htmlEvent.indexOf(extraValue);
        } else {
            extraIndex = 0;
        };
        startOfSearchIndex = htmlEvent.indexOf(startValue, extraIndex) + startValue.length;
        endOfSearchIndex = htmlEvent.indexOf(endValue, startOfSearchIndex);
        return htmlEvent.substr(startOfSearchIndex, endOfSearchIndex - startOfSearchIndex); //return the found information
    };
};


/*
 * FUNCTION: eventSorter (helpfunction)
 * PURPOSE: Make an event ready for the database
 * PARAMETERS: current event and configurations
 * RETURNS: proper event form
 */

function eventSorter(eventList, config) {
    let eventObj = new eventObject(); //create the proper event form

    let stringBuilder = '', //extra strings
        extraString = '/';

    //title
    stringBuilder = '';
    stringBuilder = eventList.name;
    stringBuilder = stringBuilder.replace(/&amp;/g, '&');
    eventObj.title = stringBuilder.replace(/&apos;/g, '`');
    //console.log(sortedEventList[eventCounter].title);

    //dateTime
    let year = 0,
        month = 0,
        day = 0,
        hour = 0,
        min = 0,
        currentCentury = 20;

    if (eventList.date.length === 8) { //looking for the current start of the date
        year = currentCentury + eventList.date.slice(6, 8);
    } else {
        year = eventList.date.slice(6, 10);
    }
    //console.log(year);
    month = eventList.date.slice(3, 5);
    //console.log(month);
    day = eventList.date.slice(0, 2);
    //console.log(day);
    hour = eventList.time.slice(0, 2);
    //console.log(hour);
    min = eventList.time.slice(3, 5);
    //console.log(min);

    eventObj.event_datetime = new Date(year, month, day, hour, min);

    //city
    let upperString = '',
        lowerString = '',
        cityIdentifyer = '';

    let cityIndex = 0;

    stringBuilder = '';
    stringBuilder = eventList.location;
    cityIndex = stringBuilder.indexOf(' ');

    upperString = stringBuilder.slice(0, 1);
    lowerString = stringBuilder.slice(1);

    if (cityIndex !== -1) { //check for city identifyers
        lowerString = stringBuilder.slice(1, cityIndex);
        cityIdentifyer = stringBuilder.slice(cityIndex + 1);

        upperString = upperString.toUpperCase();
        lowerString = lowerString.toLowerCase();
        cityIdentifyer = cityIdentifyer.toUpperCase();

        stringBuilder = '';
        stringBuilder = stringBuilder.concat(upperString, lowerString, ' ', cityIdentifyer);
    } else {

        upperString = upperString.toUpperCase();
        lowerString = lowerString.toLowerCase();

        stringBuilder = '';
        stringBuilder = stringBuilder.concat(upperString, lowerString);
    }

    eventObj.city = stringBuilder; //copy the final city string into the proper place in the array
    //console.log(eventObj.city);

    //address
    eventObj.address = eventList.venue;

    //description
    eventObj.description = eventList.description;

    //price
    eventObj.price = parseFloat(eventList.price);

    //source
    //console.log(eventList[eventCounter].link);
    stringBuilder = '';
    stringBuilder = stringBuilder.concat(config.hostName, eventList.link); //adding host name to event link
    eventObj.source = stringBuilder;

    //image source
    //console.log(eventList[eventCounter].image);
    stringBuilder = '';
    stringBuilder = stringBuilder.concat(config.hostName, extraString, eventList.image); //adding hostname and / to image link
    eventObj.image_source = stringBuilder;

    //fk type (category)
    eventObj.fk_type = eventList.category;

    return eventObj;
}

module.exports = {
    cleanData
};