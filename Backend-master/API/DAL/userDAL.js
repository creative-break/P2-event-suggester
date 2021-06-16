const db = require('../externScripts/mySQL/mysqlDB');

/*
 * FUNCTION: getUsers
 * PURPOSE: gets all users in database
 * PARAMETERS:
 * RETURNS: promise --> resolve([users])
 */
async function getUsers() {
    let p = new Promise(async (resolve, reject) => {
        try {
            let result = await db.mySQL_Handler("SELECT username FROM users");

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
 * FUNCTION: getUserByUsername
 * PURPOSE: gets a user by username in database
 * PARAMETERS: username
 * RETURNS: promise --> resolve(user)
 */
function getUserByUsername(username) {
    let p = new Promise(async (resolve, reject) => {
        try {
            let user;
            let result = await db.mySQL_Handler("SELECT id,username,password FROM users WHERE username = ?", [username]);

            if (result.error) {
                console.error(result.message);
            } else {
                user = result.result[0];
            }

            resolve(user);
        } catch (ex) {
            console.log(ex);
            reject();
        }
    });
    return p;
}

/*
 * FUNCTION: createUser
 * PURPOSE: creates a user in database
 * PARAMETERS: username, password
 * RETURNS: promise --> resolve(true - success/false - failed)
 */
async function createUser(username, password) {
    let p = new Promise(async (resolve, reject) => {
        try {
            let result = await db.mySQL_Handler("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);

            if (result.error) {
                console.error(result.message);
            };

            resolve(!result.error);
        } catch (ex) {
            console.log(ex);
            reject();
        }
    });
    return p;
}

/*
 * FUNCTION: addRefreshToken
 * PURPOSE: adds a new refreshtoken to database
 * PARAMETERS: user, token
 * RETURNS: promise --> resolve(true - success/false - failed)
 */
function addRefreshToken(user, token) {
    let p = new Promise(async (resolve, reject) => {
        try {
            let result = await db.mySQL_Handler("INSERT INTO refreshTokens (fk_users, token) VALUES (?, ?)", [user.id, token]);

            if (result.error) {
                console.error(result.message);
            }

            resolve(!result.error);
        } catch (ex) {
            console.log(ex);
            reject();
        }
    });
    return p;
}

/*
 * FUNCTION: checkIfRefreshTokenExist
 * PURPOSE: checks if a refresh token exists in database
 * PARAMETERS: token
 * RETURNS: promise --> resolve(true - exists/false - does not exist)
 */
function checkIfRefreshTokenExist(token) {
    let p = new Promise(async (resolve, reject) => {
        try {
            let result = await db.mySQL_Handler("SELECT token FROM refreshTokens WHERE token = ?", [token]);

            if (result.error) {
                console.error(result.message);
            }

            resolve(result.result.length > 0 ? true : false);
        } catch (ex) {
            console.log(ex);
            reject();
        }
    });
    return p;
}


module.exports = {
    getUserByUsername,
    createUser,
    addRefreshToken,
    checkIfRefreshTokenExist,
    getUsers
};