const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const UserSchema = new Schema({
    userID: {
        type: String,
        required: [true, 'userID is required']
    },
    userName: {
        type: String,
        required: [true, 'userName is required']
    },
    // 'HR', 'Trainer' 'Engineer'
    userType: {
        type: String,
        default: 'Engineer'
    },
    involvedCourses: {
        type: Array
    },
    completedCourses: {
        type: Array
    }
});

module.exports = mongoose.model('user', UserSchema);