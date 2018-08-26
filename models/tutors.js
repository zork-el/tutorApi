var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var tutorSchema = new Schema({
    admin: {
        type: Boolean,
        default: false
    },
    user: {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        isEdit: {
            type: Boolean,
            required: false
        }
    }
    }, {
        timestamps: true
});

tutorSchema.plugin(passportLocalMongoose);

var Tutors = mongoose.model('Tutor', tutorSchema);

module.exports = Tutors;