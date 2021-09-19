const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const ClassAppliedSchema = new Schema({
    className: {
        type: String,
        required: [true, 'className is required']
    },
    courseName: {
        type: String,
        required: [true, 'courseName is required']
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

module.exports = mongoose.model('classApplied', ClassAppliedSchema);