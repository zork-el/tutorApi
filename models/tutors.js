var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var tutorSchema = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
});

tutorSchema.plugin(passportLocalMongoose);

var Tutors = mongoose.model('Tutor', tutorSchema);

module.exports = Tutors;