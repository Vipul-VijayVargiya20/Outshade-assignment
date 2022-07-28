
const eventModel = require('../model/eventModel')
const createError = require('http-errors')
const { isValidObjectId } = require('../utils/validators')


const createEvent = async (req, res, next) => {

    try {

        let { name, eventdate, createdBy } = req.body

        if (!isValidObjectId(createdBy)) {
            throw createError(400, `invalid Object ID`)
        }

        if (req['loggedInUser'] != createdBy) {
            throw createError.Forbidden()
        }

        let pattern = /(^(((\d\d)(([02468][048])|([13579][26]))-02-29)|(((\d\d)(\d\d)))-((((0\d)|(1[0-2]))-((0\d)|(1\d)|(2[0-8])))|((((0[13578])|(1[02]))-31)|(((0[1,3-9])|(1[0-2]))-(29|30)))))\s(([01]\d|2[0-3]):([0-5]\d):([0-5]\d))$)/

        if (!pattern.test(eventdate)) {
            throw createError(400, `please provide date in yyyy-mm-dd HH:MM:SS  format`)
        }

        let newEvent = await eventModel.create({ name, eventdate, createdBy })

        res.status(201)
            .json({
                message: 'new Event Created Successfully',
                data: newEvent
            })


    } catch (error) {
        next(error)
    }

}

const addInvitees = async (req, res, next) => {

    try {

        let eventId = req.params.eventId
        let { invitees } = req.body

        if (!isValidObjectId(eventId)) {
            throw createError(400, `invalid EventId`)
        }

        const isEventExist = await eventModel.findById(eventId)

        if (!isEventExist) {
            throw createError(404, `no event found By the given Id`)
        }

        if (req['loggedInUser'] != isEventExist.createdBy) {
            throw createError.Forbidden(`this event Does Not Belongs To You`)
        }

        const updatedEvent = await eventModel.findByIdAndUpdate(eventId,
            {
                $addToSet: { invitees: invitees }
            },
            { new: true }
        )

        res.status(200)
            .json({
                message: `Invitees Added SuccessFully`,
                data: updatedEvent
            })


    } catch (error) {
        next(error)
    }

}

const listEvents = async (req, res, next) => {

    try {

        let { page, size, date, name } = req.query
        let filterQuery = {}

        if (!page) {
            page = 1
        }

        if (!size) {
            size = 5
        }

        if ('date' in req.query) {

            let pattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/

            if (!pattern.test(date)) {
                throw createError(400, `please input date param in YYYY-MM-DD format`)
            }

            filters['eventdate'] = { $regex: date, $options: "i" }
        }

        if ('name' in req.query) {
            filters['eventdate'] = { $regex: name, $options: "i" }
        }

        const limit = parseInt(size)
        const skip = (page - 1) * size
        const events = await eventModel.find(filterQuery).limit(limit).skip(skip)
        res.status(200)
            .json({
                message: `Success`,
                page, size, data: events
            })

    } catch (error) {
        next(error)
    }

}

const updateEvent = async (req, res, next) => {

    try {

        let eventId = req.params.eventId
        if (!isValidObjectId(eventId)) {
            throw createError(400, `invalid event id`)
        }

        let isEventExist = await eventModel.findById(eventId)
        if (!isEventExist) {
            throw createError(404, `no event found by the given id`)
        }

        if (!req['loggedInUser'] != isEventExist.createdBy) {
            throw createError.Forbidden(`only the creator can update the event`)
        }

        let { name, eventdate, invitees } = req.body

        const updatedData = await eventModel.findByIdAndUpdate(eventId,
            { $set: { name, eventdate, invitees } },
            { new: true }
        )

        return res.status(200)
            .json({
                message: `event updated`,
                data: updatedData
            })

    } catch (error) {
        next(error)
    }

}


module.exports = {
    createEvent,
    addInvitees,
    listEvents,
    updateEvent
}