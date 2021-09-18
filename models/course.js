const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const UserSchema = new Schema({
    courseID: {
        type: String,
        unique: true,
        required: [true, 'courseID is required']
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

module.exports = mongoose.model('course', UserSchema);