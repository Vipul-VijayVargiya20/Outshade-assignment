const mongoose = require('mongoose')

const userShema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        enum: ['Mr', 'Miss', 'Mrs']
    },

    name: {
        type: String,
        required: true,
        lowercase: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase : true
    },

    password: {
        type: String,
        required: true,
        trim: true,

    }

}, { timestamps: true })

module.exports = mongoose.model('User', userShema)