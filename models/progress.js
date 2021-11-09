const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const ProgressSchema = new Schema({
    courseCode: {
        type: String,
        required: [true, 'courseCode is required']
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
    sectionMaterialName: {
        type: Array,
        default: []
    },
    isSectionQuizComplete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('progress', ProgressSchema);