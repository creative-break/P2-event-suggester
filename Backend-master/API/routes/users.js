'use strict';
require('dotenv').config();
const express = require('express');
const authBLL = require('../BLL/authenticationBLL');
const userBLL = require('../BLL/userBLL');
const router = express.Router();

/* GET users listing. */
//router.get('/', authBLL.authenticate, async (req, res) => {
//    try {
//        res.json(await userBLL.getAllUsers());
//    } catch (ex) {
//        console.error(ex.message);
//        res.sendStatus(500);
//    }
//});

/*
 * Route: register route for user reqeusts
 * PURPOSE: handles request to register a new user.
 */
router.post('/register', authBLL.authenticate, async (req, res) => {
    try {
        const result = await userBLL.createNewUser(req.body.username, req.body.password);
        res.status(result.statusCode).send(result.message);
    } catch (ex) {
        console.error(ex);
        res.sendStatus(500);
    }
});

/*
 * Route: getToken route for user reqeusts
 * PURPOSE: handles request for logins.
 */
router.post('/getToken', async (req, res) => {
    try {
        const result = await authBLL.createToken(req.body.username, req.body.password);
        if (result.statusCode === 200) {
            res.json(result.object);
        }
        else {
            res.status(result.statusCode).send(result.message);
        }
    } catch (ex) {
        console.error(ex);
        res.sendStatus(500);
    }
});

/*
 * Route: token route for user reqeusts
 * PURPOSE: handles request for new access tokens by refresh token.
 */
router.post('/token', async (req, res) => {
    try {
        const result = await authBLL.createRefreshToken(req.body.refreshToken);
        if (result.statusCode == 200) {
            res.json(result.object);
        }
        else {
            res.status(result.statusCode).send(result.message);
        }
    } catch (ex) {
        console.error(ex.message);
        res.sendStatus(500);
    }
});

module.exports = router;
