const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const GradeSchema = new Schema({
    courseName: {
        type: String,
        required: [true, 'courseName is required']
    },
    className: {
        type: String,
        required: [true, 'className is required']
    },
    sectionName: {
        type: String,
        required: [true, 'sectionName is required']
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