const mongoose = require('mongoose');
const { Schema } = mongoose;

// TODO: change this to use _id and user ids

const messageSchema = new Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },
    room: String,
    timestamp: {
        type: Date,
        default: Date.now
    },
    anonymous: Boolean,
    message: String
});

module.exports = mongoose.model('messages', messageSchema);
