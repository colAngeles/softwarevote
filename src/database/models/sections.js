require('../connect')
const db = require('mongoose');
const { Schema } = db;

const Sections = new Schema({
    sectionName: {type: String, uppercase: true},
    blankVotes: {type: Number, default: 0},
})
module.exports = db.model('sections', Sections);
