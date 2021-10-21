const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const UserSchema = new Schema({
    userID: {
        type: String,
        unique: true,
        required: [true, 'userID is required']
    },
    userName: {
        type: String,
        required: [true, 'userName is required']
    },
    // 'Human Resource', 'Trainer' 'Learner'
    userType: {
        type: String,
        default: 'Trainer'
    },
    learningCourses: {
        type: Array
    },
    teachingCourses: {
        type: Array
    },
    completedCourses: {
        type: Array
    }
});

module.exports = mongoose.model('user', UserSchema);