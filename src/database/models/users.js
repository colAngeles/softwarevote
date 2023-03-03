const db = require('mongoose');
const { Schema } = db;
const User = new Schema({
    username: {type: String, required: true, trim: true},
    firstname: String,
    lastname: String,
    vote: {type: Boolean, default: false},
    section: {type: String, trim: true},
    role: {type: String, default: 'voter', lowercase: true, trim: true}
})
module.exports = db.model('users', User);