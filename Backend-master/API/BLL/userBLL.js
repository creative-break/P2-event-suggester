const bcrypt = require('bcryptjs');
const userDAL = require('../DAL/userDAL');

/*
 * FUNCTION: createNewUser
 * PURPOSE: creates new users in the system
 * PARAMETERS: username, password
 * RETURNS: object with following:
 *  null,
 *  message,
 *  statuscode which follow HTTP statuscodes
 */
async function createNewUser(username, password) {
    let model = {
        object: null,
        message: "",
        statusCode: 500
    };

    try {
        const hashedPassword = await bcrypt.hash(password, 10); //hash password

        if (await userDAL.createUser(username, hashedPassword))
            model.statusCode = 201;
        else
            model.statusCode = 409;
    }
    catch (ex) {
        model.statusCode = 500;
        console.error(ex);
    }

    return model;
}

/*
 * FUNCTION: getAllUsers
 * PURPOSE: get all users in the system
 * PARAMETERS: username, password
 * RETURNS: object with following:
 *  [usernames],
 *  message,
 *  statuscode which follow HTTP statuscodes
 */
async function getAllUsers() {
    let model = {
        object: await userDAL.getUsers(),
        message: "",
        statusCode: 200
    };

    return model;
}

module.exports = {
    createNewUser,
    getAllUsers
};