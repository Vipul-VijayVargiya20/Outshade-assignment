
const mongoose = require('mongoose')
const joi = require('joi')

const userSchema = joi.object({

    title: joi.string().required().valid('Mr', 'Miss', 'Mrs'),
    name: joi.string().required().trim().min(3).max(30),
    email: joi.string().email().required(),
    password: joi.string().min(3).required()

})


const authValidations = joi.object({

    email: joi.string().required().email().trim(),
    password: joi.string().required().trim()

})

const validatePassword = joi.object({
    password: joi.string().required().trim(),
    newPassword: joi.string().required().trim()
})

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id)
}

module.exports = {

    userSchema,
    authValidations,
    validatePassword,
    isValidObjectId

}