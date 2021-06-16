/*
    Event prototype that contains form to put into database
*/

function eventObject(title, event_datetime, creation_datetime, country, postcode, city, address, description, price, duration, source, image_source, fk_type, remove_event) {

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
    this.remove_event = remove_event;
};

module.exports = eventObject;