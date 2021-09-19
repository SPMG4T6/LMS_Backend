const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const ProgressSchema = new Schema({
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
    courseMaterialID: {
        type: Array
    }
});

module.exports = mongoose.model('progress', ProgressSchema);