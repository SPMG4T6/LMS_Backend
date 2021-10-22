const User = require('../models/user');

const retrieveEnrolled = (userID) => 
    new Promise((resolve, reject) => {
        User.findOne({userID: userID})
        .then(response => {
            // console.log(response);
            resolve(response);
        })
        .catch(error => {
            reject(error);
        })
    })


module.exports = retrieveEnrolled;