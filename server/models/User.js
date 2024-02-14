const mongoose = require('mongoose');
const { Schema } = mongoose;



const userSchema = new Schema({
    name: String,
    email: String,
    units: [String],
    requestingUnits: [String],
    role: {
        type: String,
        default: 'Student'
    }
});

module.exports = mongoose.model('users', userSchema);
