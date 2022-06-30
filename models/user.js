const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    tosAgreement: Boolean,
    created_on: {
        type: Date,
        default: new Date()
    },
    receiveEmails: {
        type: Boolean,
        default: false
    },
});

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

module.exports = mongoose.model('User', UserSchema);
