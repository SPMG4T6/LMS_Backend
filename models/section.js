const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const SectionSchema = new Schema({
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
    sectionSequence: {  
        type: Number,
        required: [true, 'sectionSequence is required']
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
    // array of objects, [{materialName: "something", materialLink: "www.google.com"}, ...]
    sectionMaterial: {
        type: Array,
        required: [true, 'sectionMaterial is required']
    }
});


module.exports = mongoose.model('section', SectionSchema);