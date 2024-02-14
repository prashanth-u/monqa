const mongoose = require('mongoose');

const Post = require('../models/Post');
const User = require('../models/User');
const Reply = require('../models/Reply');
const chatProperties = require('../config/chat-properties');
const { POST_TYPES, USER_ATTRS } = require('../config/constants');
const { FAQ, POST, ANNOUNCEMENT } = POST_TYPES;
const qnamaker = require('../services/qnamaker');

var Event = null;
if (chatProperties.events == true) {
    Event = require('./events')
}

module.exports = app => {
    // Validate before requests for posts
    app.all('/api/posts', function(req, res, next) {
        const { units } = req.body;
        if (units.every(unit => req.user.units.includes(unit))) {
            return next();
        }
        res.sendStatus(400);
        console.log('>> Error: User not enrolled in requested unit');
    });

    // Mark all posts as read
    app.post('/api/posts/markAllRead', function (req, res, next) {
        const query = { unit: { $in: req.body.units } },
            updateObj = { $addToSet: { readBy: req.user.id } };

        Post.updateMany(query, updateObj, function(err) {
            if (err) return next(err);
            res.sendStatus(200);
        })
    });

    // Get multiple posts
    app.post('/api/posts', async function (req, res) {
        const { units, solveStatus, read } = req.body;

        var query = { unit: { $in: units } };

        if (req.body.query) {
            const regexQuery = new RegExp(req.body.query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
            query = {
                ...query,
                $or: [
                    { title: regexQuery },
                    { body: regexQuery },
                    { tags: regexQuery }
                ]
            }
        }

        var posts = [];

        try {   // Fetch FAQs
            query = { ...query, category: { $in: [FAQ] } };

            const faqs = await Post
                .find(query)
                .populate('user', USER_ATTRS)
                .sort({ date: -1 });

            posts = posts.concat(faqs);
        } catch (err) { return next(err); }

        try {   // Fetch Posts/Announcements
            query = {
                ...query,
                category: { $in: [POST, ANNOUNCEMENT] },
                hasVerifiedAnswer: { $in: solveStatus },
            };
            if (!read) query.readBy = { $ne: req.user.id };

            const postsAnnouncements = await Post
                .find(query)
                .populate('user', USER_ATTRS)
                .sort({ date: -1 });

            posts = posts.concat(postsAnnouncements);
        } catch (err) { return next(err); }

        res.send(posts);
    });

    // Create new post
    app.post('/api/post/new', async (req, res, next) => {
        const post = {
            user: req.user.id,
            unit: req.body.unit,
            category: req.body.category,
            title: req.body.title,
            body: req.body.body,
            tags: req.body.tags || [],
        };

        if (!(req.user.units.includes(post.unit))) {
            return res.sendStatus(400);
        }
        
        var newPost = new Post(post);
        newPost.save(async function(err, doc) {
            if (err) return next(err);
            res.send(doc._id);

            if (doc.category === FAQ) {
                try {
                    const qna = { question: post.title, answer: post.body };
                    qnamaker.addQna(post.unit, doc._id, qna);
                } catch (error) {
                    console.log(`Error creating QNA: ${error.message}`);
                }
            }
        });

        if (chatProperties.events == true) {
            Event.sendUserPostEvent(post, req.user.name, req.user.email);
        }
    });

    // toggle if a post was read by user
    app.patch('/api/post/:id/toggleRead', function (req, res, next) {
        const postId = req.params.id;
        const userId = req.user.id;

        Post.findById(postId, async function(err, doc) {
            if (err) return next(err);

            if (!(req.user.units.includes(doc.unit))) {
                return res.sendStatus(400);
            }

            var updateDict;
            if (doc.readBy.includes(userId)) {
                updateDict = { $pull: { readBy: userId } };
            } else {
                updateDict = { $addToSet: { readBy: userId } };
            }

            Post.findByIdAndUpdate(postId, updateDict, function(err2, doc2) {
                if (err2) return next(err2);
                res.send(doc2);
            })
        });
    });

    app.route('/api/post/:id')
        .get(function(req, res, next) {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.sendStatus(400);
            }
    
            Post.findById(id)
                .populate('user', USER_ATTRS)
                .exec(async function(err, doc) {
                    if (err) return next(err);
                    if (!doc) return res.sendStatus(404);

                    if (!(req.user.units.includes(doc.unit))) {
                        return res.sendStatus(400);
                    }

                    res.send(doc);
                });
        })
        .patch(function(req, res, next) {        // TODO: should be patch?
            Post.findById(req.params.id, function(err, doc) {
                if (err) return next(err);
                if (!doc) return res.sendStatus(404);

                if (doc.user != req.user.id) {
                    return res.sendStatus(400);
                }

                doc.title = req.body.title,
                doc.body = req.body.body,
                doc.tags = req.body.tags,
                doc.editedDate = Date.now()

                doc.save(async function(err2) {
                    if (err2) return next(err2);
                    res.sendStatus(200);

                    if (doc.category === FAQ) {
                        try {
                            const qna = { question: doc.title, answer: doc.body };
                            qnamaker.updateQna(doc.unit, doc._id, qna);
                        } catch (error) {
                            console.log(`Error updating QNA: ${error.message}`);
                        }
                    }
                });
            });
        })
        .delete(function (req, res, next) {
            Post.findById(req.params.id, async function(err, doc) {
                if (err) return next(err);
                if (!doc) return res.sendStatus(404);

                if (doc.user != req.user.id) {
                    return res.sendStatus(400);
                }
                
                if (doc.category == POST) {
                    try {
                        const query = { post: req.params.id };
                        await Reply.deleteMany(query);
                    } catch (error) {
                        return next(err);
                    }
                } else if (doc.category == FAQ) {
                    try {
                        qnamaker.removeQna(doc.unit, doc._id);
                    } catch (error) {
                        console.log(`Error deleting QNA: ${error.message}`);
                    }
                }

                doc.remove(function(err2) {
                    if (err2) return next(err2);
                    res.sendStatus(200);
                });
            });
        });
};
