var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var skillSchema = new Schema({
    skillname: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
        timestamps: true
    });

var tutorSchema = new Schema({
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
        },
        admin: {
            type: Boolean,
            default: false
        },
        image: {
            type: String,
            default: "Path Not Set!!"
        },
        deletehash: {
            type: String,
            default: "Path Not Set!!"
        },
        signupComplete: {
            type: Boolean,
            default: false
        },
        skills: [skillSchema]
    }
}, {
        timestamps: true
    });

tutorSchema.plugin(passportLocalMongoose);

var Tutors = mongoose.model('Tutor', tutorSchema);

module.exports = Tutors;