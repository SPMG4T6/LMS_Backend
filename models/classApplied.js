const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const ClassAppliedSchema = new Schema({
    courseCode: {
        type: String,
        required: [true, 'courseCode is required']
    },
    className: {
        type: String,
        required: [true, 'className is required']
    },
    userID: {
        type: String,
        required: [true, 'userID is required']
    },
    userName: {
        type: String,
        required: [true, 'userName is required']
    }
});

module.exports = mongoose.model('classApplied', ClassAppliedSchema);