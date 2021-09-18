const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const ClassSchema = new Schema({
    classID: {
        type: String,
        required: [true, 'classID is required']
    },
    courseID: {
        type: String,
        required: [true, 'courseID is required']
    },
    className: {
        type: String,
        required: [true, 'className is required']
    },
    // array of trainers
    userID: {
        type: Array,
        required: [true, 'userID is required']
    },
    classStartDate: {
        type: Date,
        required: [true, 'classStartDate is required']
    },
    classEndDate: {
        type: Date,
        required: [true, 'classEndDate is required']
    },
    enrolmentStartDate: {
        type: Date,
        required: [true, 'enrolmentStartDate is required']
    },
    enrolmentEndDate: {
        type: Date,
        required: [true, 'enrolmentEndDate is required']
    },
    minClassSize: {
        type: Number,
        required: [true, 'minClassSize is required'],
        min: 1
    },
    maxClassSize: {
        type: Number,
        required: [true, 'maxClassSize is required'],
        min: 1
    },
    // array of strings
    enrolledStudents: {
        type: Array
    }
});

module.exports = mongoose.model('class', ClassSchema);