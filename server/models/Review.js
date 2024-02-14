const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    reviewId: mongoose.Schema.Types.ObjectId,
    userId: String,
    timestamp: Date
});

module.exports = mongoose.model('review', reviewSchema);
