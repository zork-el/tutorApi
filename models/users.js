var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
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
    _id: {
        type: Number
    },
    isEdit: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var Users = mongoose.model('User', userSchema);

module.exports = Users;