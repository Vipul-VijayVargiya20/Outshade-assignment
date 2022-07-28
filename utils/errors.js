const createError = require('http-errors')

const notFound = (req, res, next) => {
    next(createError(404, 'The Page You are Looking for is Not Found'))
}

const errorHandler = (err, req, res, next) => {

    res.status(err.status || 500)
    res.json({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })

}

module.exports = {
    notFound,
    errorHandler
}