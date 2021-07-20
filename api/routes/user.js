const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

router.post('/register', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            res.status(500).json({
                error: err
            })
        }
        else {
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                username: req.body.username,
                password: hash,
                phone: req.body.phone,
                email: req.body.email,
                userType: req.body.userType
            });

            user.save()
                .then(result => {
                    res.status(200).json({
                        newUser: result
                    })
                }).catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        }
    })
})

router.post('/login', (req, res, next) => {
    User.find({ username: req.body.username })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(500).json({
                    error: 'User Not Found !!'
                })
            }
            else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            error: 'Password didn\'t Matched !!'
                        })
                    }
                    if (result) {
                        const token = jwt.sign({
                            username: user[0].username,
                            email: user[0].email,
                            phone: user[0].phone,
                            userType: user[0].userType,
                        },
                            "UserLoginToken",
                            {
                                expiresIn: '24h'
                            });
                        res.cookie('loginCookie', token, { maxAge: 900000, httpOnly: true });
                        res.status(200).json({
                            username: user[0].username,
                            userType: user[0].userType,
                            token: token
                        });
                    }
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: 'Error !!'
            })
        })
})

router.get('/logout', (req, res, next) => {
    res.clearCookie('loginCookie');
    res.status(200).json({
        msg: "cookie cleared"
    })
})

module.exports = router;