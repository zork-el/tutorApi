const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Users = require('../models/users');
const authenticate = require('./../authenticate');

const userRouter = express.Router();

userRouter.use(bodyParser.json());

// FOR /DISHES
userRouter.route('/')
    .options((req, res) => { res.sendStatus(200); })
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })

    .get(authenticate.verifyUser, (req, res, next) => {
        Users.find({}).exec()
            .then((users) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        Users.create(req.body)
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /users');
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        Users.remove({}).exec()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// FOR /:DISH ID
userRouter.route('/:userId')
    .options((req, res) => { res.sendStatus(200); })
    .get(authenticate.verifyUser, (req, res, next) => {
        Users.findById(req.params.userId).exec()
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /users/' + req.params.userId);//
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        Users.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true }).exec()
            .then((user) => {
                res.statusCode = 200;         // Use [for (var key in Object)] to validate req.body
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        Users.findByIdAndRemove(req.params.userId).exec()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = userRouter;