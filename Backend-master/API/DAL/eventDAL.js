const db = require('../externScripts/mySQL/mysqlDB');

/*
 * FUNCTION: getEventsByPostcodeAndTimeInterval
 * PURPOSE: Finds all events based on postcode and datetime
 * PARAMETERS: postcode, dateFrom, dateTo
 * RETURNS: promise --> resolve([events])
 */
async function getEventsByPostcodeAndTimeInterval(postcode, dateFrom, dateTo) {

    let p = new Promise(async (resolve, reject) => {
        try {
            let result = await db.mySQL_Handler("SELECT events.title,events.event_datetime,events.creation_datetime,events.country,events.postcode,events.city,events.address, " +
                "events.description, events.price, events.duration, events.source, events.image_source, eventTypes.type FROM events " +
                "INNER JOIN eventTypes ON events.fk_type = eventTypes.id "+
                "WHERE events.postcode = ? AND events.event_datetime >= ? AND events.event_datetime < ?",
                [postcode, dateFrom, dateTo]);
            if (result.error) {
                console.error(result.message);
            }

            resolve(result.result);
        } catch (ex) {
            console.log(ex);
            reject();
        }
    });
    return p;
}

/*
 * FUNCTION: getAllEventsWithinTimePeriode
 * PURPOSE: Finds all events based on datetime
 * PARAMETERS: postcode, dateFrom, dateTo
 * RETURNS: promise --> resolve([events])
 */
async function getAllEventsWithinTimePeriode(dateFrom, dateTo) {
    let p = new Promise(async (resolve, reject) => {
        try {
            let result = await db.mySQL_Handler("SELECT events.title,events.event_datetime,events.creation_datetime,events.country,events.postcode,events.city,events.address, " +
                "events.description, events.price, events.duration, events.source, events.image_source, eventTypes.type FROM events " +
                "INNER JOIN eventTypes ON events.fk_type = eventTypes.id " +
                "WHERE events.event_datetime >= ? AND events.event_datetime < ?",
                [dateFrom, dateTo]);
            if (result.error) {
                console.error(result.message);
            }

            resolve(result.result);
        } catch (ex) {
            console.log(ex);
            reject();
        }
    });
    return p;
}

module.exports = {
    getEventsByPostcodeAndTimeInterval,
    getAllEventsWithinTimePeriode
};