const mongoose = require('mongoose')

const user = new mongoose.Schema({
    name:       { type: String, required: true },
    password:   { type: String, required: true },

    is_admin:   { type: Boolean, default: false },
    date:       { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', user)