const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const ProgressSchema = new Schema({
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
    userID: {
        type: String,
        required: [true, 'userID is required']
    },
    courseMaterialID: {
        type: Array
    }
});

module.exports = mongoose.model('progress', ProgressSchema);