
const router = require('express').Router()
const { createEvent, addInvitees, listEvents, updateEvent } = require('../controller/eventController')
const { protected } = require('../middleware/auth')


router.post('/createEvent', protected, createEvent)
        .patch('/addInvitees/:eventId', protected, addInvitees)
        .get('/listEvents', protected, listEvents)
        .put('/updateEvent', protected, updateEvent)



module.exports = router