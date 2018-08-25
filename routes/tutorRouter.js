const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const tutor = require('../models/tutors');
const tutorRouter = express.Router();
const authenticate = require('./../authenticate');

tutorRouter.use(bodyParser.json());

// FOR /PROMOS
tutorRouter.route('/')
    .options((req, res) => { res.sendStatus(200); })
    .get((req, res, next) => {
        tutor.find({}).exec()
            .then((tutors) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(tutors);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// FOR /SIGN UP
tutorRouter.route('/signup')
    .options((req, res) => { res.sendStatus(200); })
    .post((req, res, next) => {
        tutor.register(new tutor({ username: req.body.username }),
            req.body.password, (err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ err: err });
                }
                else {
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ success: true, status: 'Registration Successful!' });
                    });
                }
            }
        );
    });

tutorRouter.route('/login')
    .options((req, res) => { res.sendStatus(200); })
    .post(passport.authenticate('local'), (req, res, next) => {
        var token = authenticate.getToken({ _id: req.user._id });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, token: token, status: 'You are Logged In!' });
    });

tutorRouter.route('/logout')
    .options((req, res) => { res.sendStatus(200); })
    .get((req, res) => {
        if (req.session) {
            req.session.destroy();
            res.clearCookie('session-id');
            res.redirect('/');
        } else {
            var err = new Error('You are not logged in!');
            err.status = 403;
            next(err);
        }
    });

module.exports = tutorRouter;