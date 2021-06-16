const eventDAL = require('../DAL/eventDAL');
const geoHelper = require('../externScripts/util/coordinateToGeoInfo');

const beforeNoonHourDefine = 12; //Hour define for events beforenoon
const afterNoonHourDefine = 17; //Hour define for events before evening


/*
 * FUNCTION: getEventsWithinArea
 * PURPOSE: Find all events within a given area based on postcode.
 * PARAMETERS: longitude, latitude, radius
 * RETURNS: object with events for following:
 *  beforenoon[],
 *  afternoon[],
 *  evening[]
 */
async function getEventsWithinArea(longitude, latitude, radius) {

    return await findEvents(longitude, latitude, radius);
}


/*
 * FUNCTION: getAllEvents
 * PURPOSE: Find all events.
 * PARAMETERS:
 * RETURNS: object with events for following:
 *  beforenoon[],
 *  afternoon[],
 *  evening[]
 */
async function getAllEvents() {

    return await findEvents();
}

/*
 * FUNCTION: findEvents
 * PURPOSE: Find all events based on postcode or all present in Database.
 * PARAMETERS: longitude, latitude, radius
 * RETURNS: object with events for following:
 *  beforenoon[],
 *  afternoon[],
 *  evening[]
 */
async function findEvents(longitude, latitude, radius) {
    const returnObj = {
        beforenoon: [],
        afternoon: [],
        evening: []
    };
    let events = [];

    try {
        const dateFrom = new Date();
        //////////TEMPORARY CODE. issues getting enough data for one day due to corona pandemic////////
        const dateTo = new Date("2020-12-31T23:59:59");
        /////////shall be replaced with code below!!!//////////////////////////////////////////////////
        //const dateTo = new Date();
        //dateTo.setHours(30, 0, 0, 0); // this ensures evening events is from 06 pm to 06am the following day.

       

        //check if database search should be done by postnumbers or just select all events within dateFrom and dateTo
        if (longitude !== undefined && latitude !== undefined && radius !== undefined) {
            
            let postNumbers = await geoHelper.resolveCoordinatesInRadiusToPostCodes(longitude, latitude, radius);
            //lookup all event for each postcode in db
            for (i = 0; i < postNumbers.length; i++) {

                const result = await eventDAL.getEventsByPostcodeAndTimeInterval(postNumbers[i], dateFrom, dateTo);

                //no need to push if no data is present
                if (result !== null && result.length > 0) {
                    events.push(result);
                }
            }
        } else {
            const result = await eventDAL.getAllEventsWithinTimePeriode(dateFrom, dateTo);

            //no need to push if no data is present
            if (result !== null && result.length > 0) {
                events.push(result);
            }
        }

        //check if there are any events to handle
        if (events.length > 0) {
            events = events.flat(); //flatten the array to 0 depth.

            //////////TEMPORARY CODE. issues getting enough data for one day due to corona pandemic////////
            const currentDay = new Date();
            for (i = 0; i < events.length; i++) {
                events[i].event_datetime.setDate(currentDay.getDate());
                events[i].event_datetime.setMonth(currentDay.getMonth());
            }
            ///////////////////////////////////////////////////////////////////////////////////////////////

            //sort the array by datetime earliest time is at first position in array
            events.sort((a, b) => {
                if (a.event_datetime > b.event_datetime) {
                    return 1;
                } else if (a.event_datetime < b.event_datetime) {
                    return -1
                } else {
                    return 0;
                }
            });

            let referenceTime = new Date(events[0].event_datetime.toDateString()); //get date for reference purpose

            referenceTime.setHours(beforeNoonHourDefine, 0, 0, 0) //set stop time for beforenoon events
            const beforenoonEventCnt = getEventCountBeforeTime(events, referenceTime, 0, events.length - 1);
            referenceTime.setHours(afterNoonHourDefine, 0, 0, 0) //set stop time for afternoon events
            const afternoonEventCnt = getEventCountBeforeTime(events, referenceTime, beforenoonEventCnt, events.length - 1);

            //split the array into beforenoon, afternoon, evening
            returnObj.beforenoon = events.slice(0, beforenoonEventCnt);
            returnObj.afternoon = events.slice(beforenoonEventCnt, afternoonEventCnt);
            returnObj.evening = events.slice(afternoonEventCnt, events.length);
        }
    } catch(ex){
        console.error(ex);
        returnObj.beforenoon = [];
        returnObj.afternoon = [];
        returnObj.evening = [];
    }

    return returnObj;
}

/*
 * FUNCTION: getEventCountBeforeTime
 * PURPOSE: Find all events before a given datetime
 * PARAMETERS: eventObject, stopTime, start, end
 * RETURNS: Count of events before a given datetime
 */
function getEventCountBeforeTime(eventObject, stopTime, start, end) {

    let middel = 0;

    while (start <= end) {
        middel = Math.floor((end + start) / 2);
        if (eventObject[middel].event_datetime < stopTime) {
            start = middel + 1;
        } else {
            end = middel - 1;
        }
    }

    return end + 1;
}

module.exports = {
    getEventsWithinArea,
    getAllEvents
};