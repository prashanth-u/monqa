const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  title: String,
  body: String,
  category: String,
  unit: String,
  editedDate: Date,
  tags: [String],
  hasVerifiedAnswer: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  numReplies: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }]
});

module.exports = mongoose.model('posts', postSchema);
