const mysql = require('mysql');

const DBpool = mysql.createPool({
    host: 'localhost',
    user: 'sw2b2-14@student.aau.dk',
    password: 'QCNSHeyrGpXfxa2r',
    database: 'sw2b2_14',
});


function mySQL_Handler(sql_string, placeHolderArray = []) {

    let p = new Promise((resolve, reject) => {
        let returnObj = { "error": true, "message": undefined, "result": undefined };

        try {
            DBpool.getConnection((err, connection) => {
                if (err) {
                    returnObj.message = err;
                    reject(err);
                }

                connection.query(sql_string, placeHolderArray, (err, result) => {
                    connection.release();
                    if (err) {
                        returnObj.message = err;
                    } else {
                        returnObj.error = false;
                        returnObj.result = result;
                    }
                    
                    resolve(returnObj);
                });
            });
        } catch (ex) {
            console.error(ex);
            reject();
        }
    });
    return p;
}





module.exports = {
    mySQL_Handler,
};