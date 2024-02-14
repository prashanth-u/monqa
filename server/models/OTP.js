const mongoose = require('mongoose');
const { Schema } = mongoose;

const otpSchema = new Schema({
    name: String,
    otpId: mongoose.Schema.Types.ObjectId,
    email: String,
    timestamp: Date,
    role: String,
    otpString: String,
    used: Boolean
});

module.exports = mongoose.model('otp', otpSchema);
