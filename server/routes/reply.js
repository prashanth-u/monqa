const User = require('../models/User');
const Post = require('../models/Post');
const Reply = require('../models/Reply');
const constants = require('../config/constants');
const chatProperties = require('../config/chat-properties');

const { POST } = constants.POST_TYPES;
const { ADMIN } = constants.USER_TYPES;

var Event = null
if (chatProperties.events == true) {
    Event = require('./events')
}

async function validate(postId, userId, checkAdmin = false) {
    try {
        const post = await Post.findById(postId);
        const user = await User.findById(userId);
        if (post.category !== POST ||
            !user.units.includes(post.unit) ||
            checkAdmin && user.role !== ADMIN) {
                return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

async function validateOwner(replyId, userId) {
    try {
        const reply = await Reply.findById(replyId);
        if (reply.user != userId) return false;
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = app => {
    // Get all replies of a post
    app.get('/api/replies/:postId', async (req, res, next) => {
        const { postId } = req.params;

        const valid = await validate(postId, req.user.id);
        if (!valid) return res.sendStatus(400);

        Reply.find({ post: req.params.postId })
            .populate('user', constants.USER_ATTRS)
            .exec(function(err, docs) {
                if (err) return next(err);
                res.send(docs);
            });
    });

    // Get verified answers of a post
    app.get('/api/answers/:postId', async (req, res, next) => {
        const { postId } = req.params,
            query = { post: postId, isVerifiedAnswer: true };

        const valid = await validate(postId, req.user.id);
        if (!valid) return res.sendStatus(400);

        Reply.find(query)
            .populate('user', constants.USER_ATTRS)
            .exec(function(err, docs) {
                if (err) return next(err);
                res.send(docs);
            });
    });

    // mark reply as answer
    app.post(`/api/reply/:id/markAnswer`, async (req, res) => {
        Reply.findById(req.params.id, async function(err, doc) {
            if (err) return next(err);
            if (!doc) return res.sendStatus(404);

            const valid = await validate(doc.post, req.user.id, true);
            if (!valid) return res.sendStatus(400);

            doc.isVerifiedAnswer = true;

            doc.save(function(err2) {
                if (err2) return next(err2);

                const updateObj = {
                    hasVerifiedAnswer: true,
                    readBy: [req.user.id]
                };
                Post.findByIdAndUpdate(doc.post, updateObj, function(err3) {
                    if (err3) return next(err3);
                    res.sendStatus(200);
                });
            });
        });
    });

    // Create new reply
    app.post('/api/reply/:postId', async (req, res, next) => {
        const { postId } = req.params,
            userId = req.user.id;

        const valid = await validate(postId, userId);
        if (!valid) return res.sendStatus(400);

        const newReply = {
            body: req.body.reply,
            user: userId,
            post: postId
        };
        Reply.create(newReply, function(err) {
            if (err) return next(err);

            const updateObj = { 
                $inc: { numReplies: 1 }, 
                readBy: [userId] 
            };
            Post.findByIdAndUpdate(postId, updateObj, function(err2) {
                if (err2) return next(err2);
                res.sendStatus(200);
            })
        });

        if (chatProperties.events == true){
            Event.sendUserReplyEvent(req.user.name, req.user.email)
        }
    });

    // Delete reply
    app.delete(`/api/reply/:id`, async (req, res, next) => {
        Reply.findById(req.params.id, async function(err, doc) {
            if (err) return next(err);
            if (!doc) return res.sendStatus(404);

            const valid = await validateOwner(req.params.id, req.user.id);
            if (!valid) return res.sendStatus(403);

            doc.remove(function(err2) {
                if (err2) return next(err2);

                const query = { post: doc.post, isVerifiedAnswer: true };
                Reply.countDocuments(query, function(err3, count) {
                    if (err3) return next(err3);

                    var updateObj = { $inc: { numReplies: -1 } };
                    if (count === 0) updateObj.hasVerifiedAnswer = false;

                    Post.findByIdAndUpdate(doc.post, updateObj, function(err4) {
                        if (err4) return next(err4);
                        res.sendStatus(200);
                    });
                });
            });
        });
    });
}
