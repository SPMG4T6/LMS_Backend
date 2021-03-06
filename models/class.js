const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const ClassSchema = new Schema({
    courseCode: {
        type: String,
        required: [true, 'courseCode is required']
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
    // [{question: "Something", option: [1, 2, 3, 4], answer: 1}, ...]
    quizDetails: {
        type: Array,
        default: []
    },
    quizDuration: {
        type: Number,
        default: 10
    },
    classStartDate: {
        type: String,
        required: [true, 'classStartDate is required']
    },
    classEndDate: {
        type: String,
        required: [true, 'classEndDate is required']
    },
    enrolmentStartDate: {
        type: String,
        required: [true, 'enrolmentStartDate is required']
    },
    enrolmentEndDate: {
        type: String,
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