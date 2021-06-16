/*
    Event prototype to be used in cleanData
*/

function EventInfo(link, name, location, venue, date, time, price, description, imageLink, category) {

    this.link = link;
    this.name = name;
    this.location = location;
    this.venue = venue;
    this.date = date;
    this.time = time;
    this.price = price;
    this.description = description;
    this.imageLink = imageLink;
    this.category = category;
};

module.exports = EventInfo;