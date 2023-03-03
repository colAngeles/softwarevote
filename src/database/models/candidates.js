const db = require('mongoose')
const {Schema} = db

const candidate =  new Schema({
    id: {type: Number, required: true},
    image: {type: String, required: true},
    candidate: {
        type: String,
        require: true,
        uppercase: true
    },
    formula: {
        type: String, 
        required: true,
        uppercase: true
    },
    section: {type: String, required: true, uppercase: true},
    votes: {type: Number, required: true, default: 0}
})

module.exports = db.model('candidate', candidate)