const passport = require('passport');
const chatProperties = require('../config/chat-properties');
var Event = null
var crypto = require('crypto');
var OTP = require('../models/OTP');
const Review = require('../models/Review');

var base64url = require('base64url');

if (chatProperties.events == true) {
    Event = require('./events')
}

function randomStringAsBase64Url(size) {
    return base64url(crypto.randomBytes(size));
}

module.exports = app => {
    app.post('/api/registerauth', (req, res) => {
            if (chatProperties.events == true)
            {
                Event.sendUserLoginEvent(req.user)
            }
    })

    app.get('/auth/google/callback', 
        passport.authenticate('google'), 
        (req, res) => {
            res.redirect('/');
        }
    );

    // authenticate with passport
    app.get('/auth/google', 
        passport.authenticate('google', {
            scope: ['profile', 'email'],
            hd: 'monash.edu'
        })
    );

    // logout
    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.get('/api/reviewStatus', (req,res) => {
        Review.find({userId : req.user.id}, function (err, docs) {
            if (docs.length) {
                res.send(false);
            } else {
                if (chatProperties.review == true) {
                    res.send(true);
                }
            }
        });
    })

    app.get('/api/otp/:unit',async (req, res) => {
        try {
            var unit = req.params.unit
            if (req.user.units.includes(unit)) {
                var otpString = String(randomStringAsBase64Url(20))
                const newOtp = new OTP({
                    name: req.user.name,
                    email: req.user.username,
                    timestamp: new Date(),
                    role: req.user.role,
                    otpString: otpString,
                    used: false
                });
                await newOtp.save();
                res.send(otpString)
            } else {
                res.status(403);
                res.send('Forbidden Request');
            }
        } catch (error) {
            console.error(error.message);
        }
    })
};
