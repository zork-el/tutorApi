const express = require('express');
const bodyParser = require('body-parser');
const tutor = require('../models/tutors');
const tutorRouter = express.Router();

tutorRouter.use(bodyParser.json());

// FOR /PROMOS
tutorRouter.route('/')
    .get((req, res, next) => {
        res.end("Respond with a Resource");
    });

// FOR /SIGN UP
tutorRouter.route('/signup')
    .options((req, res) => { res.sendStatus(200); })
    .post((req, res, next) => {
        tutor.findOne({ username: req.body.username }).exec()
            .then((user) => {
                if (user != null) {
                    var err = new Error('User ' + req.body.username + ' already exists!');
                    err.status = 403;
                    next(err);
                }
                else {
                    return tutor.create({
                        username: req.body.username,
                        password: req.body.password
                    });
                }
            })
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ status: 'Registration Successful!' })
            }, (err) => next(err))
            .catch((err) => next(err));
    });

tutorRouter.route('/login')
    .options((req, res) => { res.sendStatus(200); })
    .post((req, res, next) => {
        if (!req.session.user) {
            var authHeader = req.headers.authorization;

            if (!authHeader) {
                var err = new Error("You are Not Authenticated!");
                res.setHeader('WWW-Authenticate', 'Basic');
                err.status = 401;
                return next(err);
            }

            var authUserPass = authHeader.toString().split(' ')[1]  //gets string containing username:password.
            var auth = Buffer.from(authUserPass, 'base64').toString().split(':');    //splits authUserPass into array containing username:password.
            var username = auth[0];
            var password = auth[1];

            tutor.findOne({ username: username })
                .then((user) => {
                    if (user.username === username && user.password === password) {
                        req.session.user = 'authenticated';
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('You Are Authenticated');
                    } else if (user.password != password) {
                        var err = new Error("Your Password is Incorrect!");
                        err.status = 403;
                        return next(err);
                    } else if (user === null) {
                        var err = new Error("User " + username + " does not exist");
                        err.status = 403;
                        return next(err);
                    }
                })
                .catch((err) => next(err));
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You Are Already Authenticated');
        }
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