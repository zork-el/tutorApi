var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var skillSchema = new Schema({
    isActive: {
        type: Boolean,
        default: false
    },
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
            default: "https://picsum.photos/300/200"
        },
        deletehash: {
            type: String,
            default: "no path set"
        },
        signupComplete: {
            type: Boolean,
            default: false
        },
        skills: [skillSchema]
    },
    security: {
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    }
}, {
        timestamps: true
    });

tutorSchema.plugin(passportLocalMongoose);

var Tutors = mongoose.model('Tutor', tutorSchema);

module.exports = Tutors;