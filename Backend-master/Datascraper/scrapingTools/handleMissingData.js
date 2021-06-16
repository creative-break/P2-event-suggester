const request = require('./WebRequest.js');

/*
 * FUNCTION: handleMissingData
 * PURPOSE: Checks the "arrangement" for missing or invalid information
 * PARAMETERS: An object
 * RETURNS: An object
 */
async function handleMissingData(eventObject) {

    let extraString = '';
    let p = new Promise(async (resolve, reject) => {

        // title_handler     
        if ((typeof eventObject.title === 'undefined') || (eventObject.title.length === 0) || (eventObject.title.length > 100)) {   // Checks if the there is a title if not remove_event is set to true
            eventObject.remove_event = true;
        } else {
            eventObject.remove_event = false;
        }
        
        // date_handler
        if (Object.prototype.toString.call(eventObject.event_datetime) !== '[object Date]') { // Checks if the date is the right format, if not gives the linux start date
            eventObject.event_datetime = new Date(1970, 1, 1, 0, 0);
        }

        eventObject.creation_datetime = new Date();    // Sets new date for creation_datetime

        eventObject.country = 'Denmark';    // sets the country to Denmark

        // postcode_handler
        if (typeof eventObject.postcode !== 'number') {
            try {

                let aarhus = 'Aarhus',  
                    aarhusC = 'Aarhus C';

                if (eventObject.city === aarhus) {  // Unique case for Aarhus since www.dawa.aws.dk require Aarhus C to find a postcode
                    eventObject.city = aarhusC;
                }
                //console.log(eventObject.city);

                extraString = eventObject.city;
                extraString = extraString.replace(/ /g, '%20');     // Replaces widespace with %20 to match the value expected from www.dawa.aws.dk
                let dawaStringPost = await getPostCity('dawa.aws.dk', '/postnumre?navn=', extraString);
                //console.log(dawaStringPost);

                let dawaObjPost = JSON.parse(dawaStringPost);   
                //console.log(dawaObjPost[0].nr);
                if (dawaObjPost.length === 0) {
                    eventObject.postcode = -1;
                } else {

                    let postalCode = dawaObjPost[0].nr;
                    //console.log(postalCode);
                    let postalCodeInt = Number(postalCode);
                    eventObject.postcode = postalCodeInt;
                    //console.log(eventObject.postcode);
                }
            } catch (err) {
                console.log(err);
                reject(err);
            }
        }

        // city_handler
        if ((typeof eventObject.city === 'undefined' || eventObject.city.length === 0) && typeof eventObject.postcode === 'number' && eventObject.postcode !== -1) {    // Looks for a city if postcode is defined and city is missing
            try {
                
                let dawaStringCity = await getPostCity('dawa.aws.dk', '/postnumre/', eventObject.postcode)
                let dawaObjCity = JSON.parse(dawaStringCity);
                //console.log(dawaObjCity);
                let city = dawaObjCity.navn;
                eventObject.city = city;
                //console.log(eventObject.city);
            } catch (err) {
                console.log(err);
                reject(err);
            }
        } 
        else if (typeof eventObject.city === 'undefined' || eventObject.city.length === 0 && (typeof eventObject.postcode !== 'number' || eventObject.postcode === -1)) {
                eventObject.city = 'Ukendt';
        }

        // address_handler
        if (typeof eventObject.address === 'undefined' || eventObject.address === 0) {      // If the address is undefined or the string is empty setes value of address to 'Ukendt'
            eventObject.address = 'Ukendt';
        }

        //description_handler
        if (typeof eventObject.description === 'undefined' || eventObject.description === '') {     // If the description is undefined or the string is empty setes value of description to 'Ukendt'
            eventObject.description = 'Ukendt';
        }

        // price_handler
        if (eventObject.price < 0 || eventObject.price === '' ) {   // if the price is less than 0 or empty sets price to -1
            eventObject.price = -1; // unknown
        }

        // duration_handler
        if (eventObject.duration === undefined || eventObject.duration.length === 0) {  // Checks  for a duration if not duration is set to -1
            eventObject.duration = -1; // unknown
        }

        // source_handler
        if (typeof eventObject.source === 'undefined' || eventObject.source.length === 0 || !(eventObject.source.includes('www'))) {    // If there is no source for the event, or www is not included in the source remove_event  = true
            eventObject.remove_event = true;
        }

        //image_source_handler
        if (typeof eventObject.image_source === 'undefined' || eventObject.image_source.length === 0 || !(eventObject.image_source.includes('www'))) {  // validates if the images source has www
            eventObject.image_source = 'Ukendt';
        }
        //event_type_handler
        if (eventObject.fk_type < 1 || eventObject.fk_type > 8 || eventObject.fk_type === '' || typeof eventObject.fk_type !== "number") {  // Checks if the event has a type otherwise event_type = 8 
            eventObject.fk_type = 8; // unknown
        }
        resolve(eventObject);
    });
    return p;
}

module.exports = {
    handleMissingData,
}

/*
 * FUNCTION: getPostCity
 * PURPOSE: Helper function connects to www.dawa.aws.dk API
 * PARAMETERS: hostname, subURL, value
 * RETURNS: A promise
 */
async function getPostCity(hostName, subURL, value) {

    let header = '';
    subURL += value;

    let p = new Promise(async (resolve, reject) => {
        let data = [];
        try {
            let dawaString = await request.webRequest(header, hostName, subURL);    // Uses webRequest
            console.log(dawaString.statuscode);

            if (dawaString.statuscode === 200) {    // If everything went well pushes the data to an array
                data.push(dawaString.data);
                //console.log(dawaString);
            } else {
                reject();
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
        resolve(data);
    });
    return p;
};


/*
 * Testcode
 */

//Test dummy
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

let dummyEvent = new EventInfoDummy('DummyKoncert', new Date(2020, 04, 20, 18, 13, 37), new Date(), 'Denmark', 9670 , 'Herning', 'Andersengade 24',
                                'Or neglected agreeable of discovery concluded oh it sportsman. Week to time in john. Son elegance use weddings separate. Ask too matter formed county wicket oppose talent. He immediate sometimes or to dependent in. Everything few frequently discretion surrounded did simplicity decisively. Less he year do with no sure loud.',
                                0, 90, 'https://www.billetlugen.dk/abbey-roadlet-it-be-hyldest-til-the-beatles-billetter.html?affiliate=DKA&doc=artistPages%2Ftickets&fun=artist&action=tickets&erid=2688839', 'https://www.billetlugen.dk/abbey-roadlet-it-be-hyldest-til-the-beatles-billetter.html?affiliate=DKA&doc=artistPages%2Ftickets&fun=artist&action=tickets&erid=2688839',
                                1);

*/

/*
fk_type variable

Musik   1

Sport   2

Musical og Teater   3

Familie 4

Comedy  5

Kultur  6

Gratis  7

Ukendt  8

*/
