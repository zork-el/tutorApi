var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var tutor = require('./models/tutors');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

exports.local = passport.use(new LocalStrategy(tutor.authenticate()));
passport.serializeUser(tutor.serializeUser());
passport.deserializeUser(tutor.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: "12d"});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log('JWT Payload '+jwt_payload);
    tutor.findOne({_id: jwt_payload._id}, (err, user) => {
        if(err) {
            return done(err, false);
        } else if(user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});