const User = require('../models/User');
const { USER_TYPES } = require('../config/constants');
const { ADMIN } = USER_TYPES;

// creates user if they don't exist in database
async function createUser(email, callback) {
    var user = await User.findOne({ email });
    if (user) return callback(null, user);
    
    user = new User({ email });
    user.save(callback);
}

module.exports = app => {
    // Get list of users enrolled in unit
    app.get('/api/unit/:unit/users', async (req, res, next) => {
        const { unit } = req.params;

        if (req.user.role !== ADMIN || 
            !req.user.units.includes(unit)) {
            return res.sendStatus(403);
        }

        User.find({ units: unit }, function(err, docs) {
            if (err) return next(err);
            res.send(docs);
        });
    });

    // Request access to unit
    app.post('/api/unit/:unit/request', function(req, res, next) {
        const updateObj = { $addToSet: { requestingUnits: req.params.unit } };
        User.findByIdAndUpdate(req.user.id, updateObj, function(err) {
            if (err) return next(err);
            res.sendStatus(200);
        });
    })

    // Get list of users that are requesting access to a unit
    app.get('/api/unit/:unit/requestingUsers', async(req, res, next) => {
        if (req.user.role !== ADMIN) {
            return res.sendStatus(403);
        }

        const query = { requestingUnits: req.params.unit };
        User.find(query, function(err, docs) {
            if (err) return next(err);
            res.send(docs);
        });
    });

    // PUT: Enrol user in unit. Also removes unit from 
    //      requestingUnits array and creates new user if 
    //      one does not exist
    // DELETE: Unenrol user from unit. Also removes unit
    //         from requestingUnits array
    app.route('/api/unit/:unit/enrol/:email')
        .post(function(req, res, next) {
            if (req.user.role !== ADMIN) {
                return res.sendStatus(403);
            }
            const { email, unit } = req.params;

            const query = { email },
                updateObj = {
                    $pull: { requestingUnits: unit },
                    $addToSet: { units: unit }
                },
                options = {
                    upsert: true, 
                    setDefaultsOnInsert: true
                };
            User.findOneAndUpdate(query, updateObj, options, function(err) {
                if (err) return next(err);
                res.sendStatus(200);
            });
        })
        .delete(function(req, res, next) {
            const { email, unit } = req.params;

            if (req.user.email !== email 
                && req.user.role !== ADMIN) {
                return res.sendStatus(403);
            }

            const query = { email },
                updateObj = {
                    $pull: { 
                        requestingUnits: unit,
                        units: unit
                    },
                };
            User.findOneAndUpdate(query, updateObj, function(err) {
                if (err) return next(err);
                res.sendStatus(200);
            });
        });

    // Accept all requests for the unit
    app.post('/api/unit/:unit/enrolAll', async (req, res, next) => {
        if (req.user.role !== ADMIN) {
            return res.sendStatus(403);
        }
        
        const { unit } = req.params,
            query = { requestingUnits: unit },
            updateObj = { 
                $pull: { requestingUnits: unit },
                $addToSet: { units: unit }
            };
        
        User.updateMany(query, updateObj, function(err) {
            if (err) return next(err);
            res.sendStatus(200);
        });
    });
}
