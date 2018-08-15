var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tutorSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

var Tutors = mongoose.model('Tutor', tutorSchema);

module.exports = Tutors;