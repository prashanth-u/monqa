const mongoose = require('mongoose');
const { Schema } = mongoose;

const replySchema = new Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'posts'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  body: String,
  date: {
    type: Date,
    default: Date.now
  },
  isVerifiedAnswer: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('replies', replySchema);
