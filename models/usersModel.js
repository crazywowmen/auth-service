const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {  // Add this field
        type: Date
    },
    isLoggedIn: {  // Add this field
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', usersSchema);
