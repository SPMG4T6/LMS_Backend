const User = require('../models/user');

const retrieveApplied = (classApplication) =>
    new Promise((resolve, reject) => {
        // console.log(applicationStatus);
        User.findOne({userID: classApplication.userID})
        .then(response => {
            let applicationStatus = classApplication.status;
            response["status"] = applicationStatus;
            console.log(response);
            resolve(response);
        })
        .catch(error => {
            reject(error);
        })
    })

module.exports = retrieveApplied;