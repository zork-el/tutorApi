const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Users = require('../models/users');
const authenticate = require('./../authenticate');
const tutor = require('../models/tutors');
const clientId = '69159da709273a3';

const userRouter = express.Router();

const fetch = require('node-fetch');
const multer = require('multer');
const imgurStorage = require('multer-storage-imgur');

const storage = imgurStorage({ clientId: clientId });

const fileFilter = (req, file, cb) => {
    console.log(file);
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('What the fuck was that?!!'));
    }
};

const limits = {
    fileSize: 1024 * 1024 * 5
};

const upload = multer({ storage: storage, limits: limits, fileFilter: fileFilter });

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
        tutor.find({}).exec()
            .then((users) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /users');
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        tutor.remove({}).exec()
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
        tutor.findById(req.params.userId).exec()
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
        tutor.findByIdAndUpdate(req.params.userId, { $set: { user: req.body } }, { new: true }).exec()
            .then((user) => {
                res.statusCode = 200;         // Use [for (var key in Object)] to validate req.body
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        tutor.findByIdAndRemove(req.params.userId).exec()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

userRouter.route('/:userId/skills')
    .options((req, res) => { res.sendStatus(200); })
    .get()

    .post((req, res, next) => {
        tutor.findById(req.params.userId).exec()
            .then((user) => {
                for(let i=0; i<req.body.length; ++i) {
                    user.user.skills.push(req.body[i]);
                }
                return user.save();
            })
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user.user.skills);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

userRouter.route('/:userId/skills/:skillId')  // No support for route overloading i.e. "/:userId/image" && "/:userId/:skillId" is a bug!!
    .options((req, res) => { res.sendStatus(200); })
    .put((req, res, next) => {
        tutor.findById(req.params.userId).exec()
            .then((tutor) => {
                if (tutor) {
                    skill = tutor.user.skills.id(req.params.skillId);
                    skill.set(req.body);
                    return tutor.save();
                } else {
                    err.name = 404;
                    err.message = "tutor Not Found";
                    throw err;
                }
            })
            .then((tutor) => {
                res.status(200).json({
                    message: "Skill Updated!",
                    skill: tutor.user.skills.id(req.params.skillId)
                });
            })
            .catch(err => next(err));
    })

    .delete((req, res, next) => {
        tutor.findById(req.params.userId).exec()
            .then((tutor) => {
                if (tutor) {
                    tutor.user.skills.id(req.params.skillId).remove();
                    return tutor.save();
                } else {
                    err.name = 404;
                    err.message = "tutor Not Found";
                    throw err;
                }
            })
            .then((tutor) => {
                res.status(200).json({
                    message: "Skill Deleted!",
                    skill: tutor.user.skills.id(req.params.skillId)
                });
            })
            .catch(err => next(err));
    });

userRouter.route('/:userId/image')
    .options((req, res) => { res.sendStatus(200); })
    .post(upload.single('userImage'), (req, res, next) => {
        const id = req.params.userId;
        tutor.findById(id).exec()
            .then((tutor) => {
                if (tutor) {
                    tutor.user.image = req.file.data.link;
                    tutor.user.deletehash = req.file.data.deletehash;
                    return tutor.save();
                } else {
                    err.name = 404;
                    err.message = "tutor Not Found";
                    throw err;
                }
            })
            .then((user) => {
                      res.status(200).json({
                           message: "Image path set",
                          image: user
                        });  
                    })
            .catch(err => next(err));
    })

    .delete((req, res, next) => {
        err = {
            "name": 0,
            "message": ""
        };
        const id = req.params.userId;
        Obj = "";
        delUrl = "https://api.imgur.com/3/image/";
        tutor.findById(id).exec()
            .then((tutor) => {
                if (tutor) {
                    Obj = tutor;
                    delUrl = delUrl + tutor.user.deletehash;
                    return fetch(delUrl, {
                        method: 'delete',
                        headers: { 'Authorization': "Client-ID " + clientId }
                    });
                } else {
                    err.name = 404;
                    err.message = "tutor Not Found";
                    throw err;
                }
            })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                console.log(Obj);
                if (data.success) {
                    console.log(Obj);
                    Obj.user.image = null;
                    Obj.user.deletehash = "no path set";
                    console.log(Obj);
                    return Obj.save();
                } else {
                    err.name = 404;
                    err.message = "Image Not Found";
                    throw err;
                }
            })
            .then((savedtutor) => res.status(200).json({
                message: "tutor Image Deleted!!",
                savedtutor: savedtutor
            })
            )
            .catch(err => next(err));
    });

module.exports = userRouter;