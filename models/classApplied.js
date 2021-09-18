const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const UserSchema = new Schema({
    classID: {
        type: String,
        required: [true, 'classID is required']
    },
    courseID: {
        type: String,
        required: [true, 'courseID is required']
    },
    userID: {
        type: String,
        required: [true, 'userID is required']
    },
    // 'Pending', 'Approved', 'Rejected'
    status: {
        type: String,
        default: 'Pending'
    }
});

module.exports = mongoose.model('classApplied', UserSchema);