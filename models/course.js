const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const CourseSchema = new Schema({
    courseCode: {
        type: String,
        unique: true,
        required: [true, 'courseCode is required']
    },
    courseTitle: {
        type: String,
        required: [true, 'courseTitle is required']
    },
    courseDescription: {
        type: String,
        required: [true, 'courseDescription is required']
    },
    // array of courseID
    prereqCourses: {
        type: Array
    }
});

module.exports = mongoose.model('course', CourseSchema);