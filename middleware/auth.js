
require('dotenv').config()
const { verify } = require('jsonwebtoken')
const createError = require('http-errors')

const protected = async (req, res, next) => {

    try {

        if (!req.cookies['token']) {
            return next(createError.Unauthorized('please login first'))
        }

        const token = req.cookies['token']

        const decodeToken = verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) throw createError(401, `invalid Or Expired Token`);
            return data
        })

        req['loggedInUser'] = decodeToken.userId
        next()


    } catch (error) {
        next(error)
    }
}

/*                                          Exporting Middleware                                      */

module.exports = {
    protected
}