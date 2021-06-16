require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userDAL = require('../DAL/userDAL');

/*
 * FUNCTION: createToken
 * PURPOSE: validate user login and grant access token if user login is valid.
 * PARAMETERS: username, password
 * RETURNS: object with following:
 *  object with accesstoken and refresh token if loging is valid otherwise null, 
 *  message, 
 *  statuscode which follow HTTP statuscodes
 */
async function createToken(username, password) {
    const user = await userDAL.getUserByUsername(username);
    let model = {
        object: null,
        message: "",
        statusCode: 500
    };

    if (user != null) {
        try {
            //check password
            if (await bcrypt.compare(password, user.password)) {//use bcrypt to validate because password in db is hashed.
                const token = createAccessToken({ username: user.username });
                const refreshToken = jwt.sign({ username: user.username }, process.env.SECRET_REFRESH_TOKEN);

                if (await userDAL.addRefreshToken(user, refreshToken)){
                    model.object = {
                        token: token,
                        refreshToken: refreshToken
                    };
                    model.statusCode = 200;
                } else {
                    model.statusCode = 500;
                }
                
            } else {
                model.statusCode = 401;
            }
        }
        catch (ex) {
            model.statusCode = 500;
            console.error(ex.message);
        }
    }
    else {
        model.statusCode = 401;
    }
    return model;
}

/*
 * FUNCTION: createRefreshToken
 * PURPOSE: validate refresh tokens and create new access tokens.
 * PARAMETERS: refreshToken
 * RETURNS: object with following:
 *  object with accesstoken if refresh token is valid otherwise null,
 *  message,
 *  statuscode which follow HTTP statuscodes
 */
async function createRefreshToken(refreshToken) {
    let model = {
        object: null,
        message: "",
        statusCode: 500
    };

    if (refreshToken != null) {
        //Check if refresh token exists
        if (await userDAL.checkIfRefreshTokenExist(refreshToken)) {
            jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, (err, user) => {//validate token

                if (!err) {
                    const accToken = createAccessToken({ username: user.username });
                    model.statusCode = 200;
                    model.object = { token: accToken };
                }
                else {
                    model.statusCode = 403;
                }
            });
        } else {
            model.statusCode = 403;
        }
    }
    else {
        model.statusCode = 401;
    }

    return model;
}

/*
 * FUNCTION: authenticate
 * PURPOSE: validate access tokens if invalided or expired return otherwise continue
 * PARAMETERS: req, res, next
 * RETURNS: HTTP statuscode 401 or 403 if access token is invalid or expired
 */
function authenticate(req, res, next) {
    const authorizationheader = req.headers['authorization'];
    const token = authorizationheader && authorizationheader.split(' ')[1];

    if (token == null) {
        return res.status(401).send();
    }

    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).send();
        }
        req.user = user;
        next();
    })
}

/*
 * FUNCTION: createAccessToken
 * PURPOSE: generate access tokens(json web tokens)
 * PARAMETERS: user
 * RETURNS: JSON web tokens(JWT)
 */
function createAccessToken(user) {
    return jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '3600s' });
}

module.exports = {
    authenticate,
    createToken,
    createRefreshToken
};