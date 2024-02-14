var fs = require('fs');
const Filter = require('bad-words');

const Message = require('../models/Message');
const Review = require('../models/Review');
const azure = require('../config/azure');
const unitProperties = require('../config/unit-properties');
const chatProperties = require('../config/chat-properties');

const qnamaker = require('../services/qnamaker');
const { USER_TYPES } = require('../config/constants');
const { ADMIN } = USER_TYPES;

var Event = null
if (chatProperties.events == true) {
    Event = require('./events')
}

function validateMessage(message) {
    var filter = new Filter();
    return filter.isProfane(message);
}

module.exports = (app) => {
    const rooms = {};

    io.on('connection', function(socket) {
        socket.on('joined', function(room) {
            socket.join(room);
            rooms[room] = {};
            io.in(room).emit('getUsers');
        });

        socket.on('leave', function(room) {
            socket.leave(room);
            rooms[room] = {};
            io.in(room).emit('getUsers');
        });

        socket.on('updateUser', function(data) {
            const { room, visible, id, user } = data;

            if (!rooms[room]) rooms[room] = {};

            if (visible) rooms[room][id] = user;
            else delete rooms[room][id];

            io.in(room).emit('usersUpdated', Object.values(rooms[room]));
        })

        socket.on('typing', function(user, room) {
           socket.to(room).emit('typing', user);
        });

        socket.on('sendMessage', function(data) {
            if (validateMessage(data.message)) {
                const err = new Error('Profane message');
                return io.in(socket.id).emit('sendMessage', err);
            }
            Message.create(data, function(err) {
                if (err) return io.in(socket.id).emit('sendMessage', err);

                if (chatProperties.events == true) {
                    Event.sendUserChatEvent(data, data.room)
                }
                
                io.in(data.room).emit('sendMessage');
            });
        });

        socket.on('disconnect', function(data) {
            if (data.reason === 'io server disconnect') {
                socket.connect();
            }

            for (var room of Object.keys(rooms)) {
                delete rooms[room][data.user];
                io.in(room).emit('usersUpdated', Object.values(rooms[room]));
            }
        });
    });

    app.get('/api/messages/:room', async (req, res, next) => {
        const { room } = req.params;
        if (!(req.user.units.includes(room) || room === 'Feedback')) {
            return res.sendStatus(403);
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const query = {
            room, 
            timestamp: { $gte: today }
        };
        Message.find(query)
            .populate('user', ['_id', 'name'])
            .exec(function(err, docs) {
                if (err) return next(err);
                const response = docs.map(doc => ({
                    message: doc.message,
                    timestamp: doc.timestamp,
                    anonymous: doc.anonymous,
                    sentByUser: doc.user._id == req.user.id,
                    user: req.user.role === ADMIN || !doc.anonymous ? doc.user.name : undefined
                }));
                res.send(response);
            });
    });

    app.post('/api/qnamaker/answer', async (req, res, next) => {
        try {
            const { question, unit } = req.body;
            const answer = await qnamaker.getAnswer(unit, question);
            
            var answers = [];
            for (var a of answer.answers) {
                if (a.score !== 0) {
                    answers.push({
                        question: a.questions[0], 
                        answer: a.answer
                    });
                }
            }

            res.send(answers);
        } catch (err) { next(err); }
    });

    app.post('/api/chatcount', (req, res, next) => {
        const query = {
            room: req.body.units, 
            timestamp: { $gte: today }, 
            timestamp: { $gte: req.body.lastAccessed }
        };
        Message.find(query ,function(err, messages) {
            if (err) return next(err);
            res.send({count: len(messages)});
        });
    });
 
    app.get('/api/properties', (req, res) => {
        Review.find({userId : req.user.id}, function (err, docs) {
            if (docs.length) {
                res.send(chatProperties);
            } else {
                if (chatProperties.events == true) {
                    var questions = fs.readFileSync('config/review.txt').toString().split("\n");
                    chatProperties['question'] =  questions;
                }
                res.send(chatProperties);
            }
        });
    });


    app.get('/api/chat/permission/:unit', (req, res) => {
        if (unitProperties[req.params.unit] != undefined 
            && unitProperties[req.params.unit]['allow-anon'] != undefined) {
                const response = {
                    allowAnon: unitProperties[req.params.unit]['allow-anon']
                }
                res.send(response);
        } else {
            res.send({ allowAnon: true });
        }
    });
};
