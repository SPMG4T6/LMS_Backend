const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name field is required']
    },
    occupationType: {
        type: String,
        required: [true, 'occupationType field is required']
    },
    trainer: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('users', UserSchema);