const mongoose = require('mongoose')
const moment = require('moment');
const now = moment();


const eventSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    eventdate: {
        type: String,
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    invitees: [{

        _id: false,
        email: {
            type: String,
            ref: 'User'
        },
        invitedAt: {
            type: String,
            default: now.toDate()
        }


    }],

    timestamp: { type: String, default: now.format("dddd, MMMM Do YYYY, h:mm:ss a") }

})


module.exports = mongoose.model('Event', eventSchema)