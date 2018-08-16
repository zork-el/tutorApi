var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var tutor = require('./models/tutors');

exports.local = passport.use(new LocalStrategy(tutor.authenticate()));
passport.serializeUser(tutor.serializeUser());
passport.deserializeUser(tutor.deserializeUser());