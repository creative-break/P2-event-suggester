const DB = require('../externScripts/mySQL/mysqlDB.js');

/*
 * FUNCTION: pushData
 * PURPOSE: INSERT or UPDATE events into mySQL database
 * PARAMETERS: eventObject
 * RETURNS: A promise
 */
function pushData(eventObject) {

    p = new Promise(async (resolve, reject) => {
        let result = null;
        try {

            let result = await DB.mySQL_Handler("SELECT id FROM events WHERE source = ?", [eventObject.source]);    
            console.log(result);
            if (!result.error) {

                // Updates event in database if the event is already existing otherwise we INSERT a new event
                if (result.result.length > 0) {  
                    result = await DB.mySQL_Handler("UPDATE events SET title = ?, event_datetime = ?," + 
                    "creation_datetime = ?, country = ?, postcode = ?, city = ?, address = ?, description = ?," +
                    "price = ?, duration = ?, source = ?, image_source = ?, fk_type = ? WHERE id = ?",
                    [eventObject.title,
                    eventObject.event_datetime,
                    eventObject.creation_datetime,
                    eventObject.country,
                    eventObject.postcode,
                    eventObject.city,
                    eventObject.address,
                    eventObject.description,
                    eventObject.price,
                    eventObject.duration,
                    eventObject.source,
                    eventObject.image_source,
                    eventObject.fk_type,
                    result.result[0].id]);
                        
                } else { 

                    result = await DB.mySQL_Handler("INSERT events (title, event_datetime, creation_datetime, country, postcode, city, address, description, price, duration, source, image_source, fk_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [eventObject.title,
                    eventObject.event_datetime,
                    eventObject.creation_datetime,
                    eventObject.country,
                    eventObject.postcode,
                    eventObject.city,
                    eventObject.address,
                    eventObject.description,
                    eventObject.price,
                    eventObject.duration,
                    eventObject.source,
                    eventObject.image_source,
                    eventObject.fk_type]);
                }
            }
            
            if (result.error) {
                console.error(result.message);
                reject();
            } else {
                resolve();
            }
            }
            catch (ex) {
            console.log(ex);
            reject();
        }
    });
    return p;
};

module.exports = {
    pushData,
}


/*
 * Testcode
 */

/*
function EventInfoDummy(title, event_datetime, creation_datetime, country, postcode, city, address, description, price, duration, source, image_source, fk_type) {

    this.title = title;
    this.event_datetime = event_datetime;
    this.creation_datetime = creation_datetime;
    this.country = country;
    this.postcode = postcode;
    this.city = city;
    this.address = address;
    this.description = description;
    this.price = price;
    this.duration = duration;
    this.source = source;
    this.image_source = image_source;
    this.fk_type = fk_type;
};

let dummyEvent = new EventInfoDummy('DummyKoncert', new Date(2020, 04, 20, 18, 13, 37), new Date(), 'Denmark', 9000, 'Alborg', 'Andersengade 24',
                                'Or neglected agreeable of discovery concluded oh it sportsman. Week to time in john. Son elegance use weddings separate. Ask too matter formed county wicket oppose talent. He immediate sometimes or to dependent in. Everything few frequently discretion surrounded did simplicity decisively. Less he year do with no sure loud.',
                                100000, 90, 'https://www.billetlugen.dk/abbey-roadlet-it-be-hyldest-til-the-beatles-billetter.html?affiliate=DKA&doc=artistPages%2Ftickets&fun=artist&action=tickets&erid=2688839', 'https://www.billetlugen.dk/abbey-roadlet-it-be-hyldest-til-the-beatles-billetter.html?affiliate=DKA&doc=artistPages%2Ftickets&fun=artist&action=tickets&erid=2688839',
                                1);
*/