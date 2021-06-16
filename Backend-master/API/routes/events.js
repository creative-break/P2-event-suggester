'use strict';
require('dotenv').config();
const express = require('express');
const authBLL = require('../BLL/authenticationBLL');
const eventBLL = require('../BLL/eventBLL');
const router = express.Router();


/*
 * Route: root route for event reqeusts 
 * PURPOSE: handles request to get all events in system.
 */
router.get('/', authBLL.authenticate, async (req, res) => {
    try {
        const result = await eventBLL.getAllEvents();
        res.status(200).send(result);
    } catch (ex) {
        console.error(ex.message);
        res.sendStatus(500);
    }
});

/*
 * Route: eventsWithinArea route for event reqeusts
 * PURPOSE: handles request for events within a area.
 */
router.get('/eventsWithinArea', authBLL.authenticate, async (req, res) => {
    try {
        const result = await eventBLL.getEventsWithinArea(req.query.longitude, req.query.latitude, req.query.radius);
        res.status(200).send(result);
    } catch (ex) {
        console.error(ex.message);
        res.sendStatus(500);
    }
});

module.exports = router;