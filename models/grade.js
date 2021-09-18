const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const GradeSchema = new Schema({
    courseID: {
        type: String,
        required: [true, 'courseID is required']
    },
    classID: {
        type: String,
        required: [true, 'classID is required']
    },
    sectionID: {
        type: String,
        required: [true, 'sectionID is required']
    },
    quizID: {
        type: String,
        required: [true, 'sectionID is required']
    },
    userID: {
        type: String,
        required: [true, 'userID is required']
    },
    obtainedScore: {
        type: Number,
        required: [true, 'obtainedScore is required'],
        min: 0
    },
    totalScore: {
        type: Number,
        required: [true, 'totalScore is required'],
        min: 0
    }
});

module.exports = mongoose.model('grade', GradeSchema);