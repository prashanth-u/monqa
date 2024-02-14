const User = require('../models/User');

// creates user if they don't exist in database
// TODO: this is duplicated in unit.js
async function createUser(email, callback) {
    var user = await User.findOne({ email });
    if (user) return callback(null, user);
    
    user = new User({ email });
    user.save(callback);
}

module.exports = app => {
    // TODO: Route to check if user logged in or not

    // Get the current users info
    app.get('/api/user/current', async (req, res) => {
        // Not logged in
        if (!req.user) return res.sendStatus(400);

        res.send(req.user);
    });

    // Create new user in database
    app.post('/api/user/new', async (req, res, next) => {
        createUser(req.body.user.email, function(err, doc) {
            if (err) return next(err);
            res.send(doc);
        })
    });

    // Chnage the role of a user
    app.post('/api/user/:email/role/:role', async (req, res, next) => {
        const query = { email: req.params.email },
            updateObj = { role: req.params.role },
            options = { new: true };

        User.findOneAndUpdate(query, updateObj, options, function(err, doc) {
            if (err) return next(err);
            res.send(doc);
        });
    });
}
