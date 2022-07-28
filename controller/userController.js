
const userModel = require('../model/userModel')
const createError = require('http-errors')
const { hash, compare } = require('bcrypt')
const { sign, } = require('jsonwebtoken')
const { userSchema, authValidations, validatePassword } = require('../utils/validators')
const nodemailer = require('nodemailer')


const register = async (req, res, next) => {

    try {

        const validatioResult = await userSchema.validateAsync(req.body)
        let { title, name, email, password } = validatioResult

        const isEmailExist = await userModel.findOne({ email: email })

        if (isEmailExist) {
            throw createError(409, `this email is already in use`)
        }

        password = await hash(password, 10)

        let data = {

            title,
            name,
            email,
            password

        }
        const newUser = await userModel.create(data)

        res.status(201).json({
            message: `registration Successful`,
            data: newUser
        })

    } catch (error) {

        if (error.isJoi === true) {
            error.status = 400
        }
        next(error)

    }

}


const login = async (req, res, next) => {

    try {

        const validationResult = await authValidations.validateAsync(req.body)
        const { email, password } = validationResult

        const isUserExist = await userModel.findOne({ email: email })

        if (!isUserExist) {
            throw createError(404, `user Not Found Please Check Credintials`)
        }

        const matchPassword = await compare(password, isUserExist.password)

        if (!matchPassword) {
            throw createError(400, `Invalid Password`)
        }

        const payload = {
            userId: isUserExist._id.toString()
        }

        const options = {
            expiresIn: process.env.JWT_EXPIRE
        }

        const secret = process.env.JWT_SECRET

        const token = sign(

            payload,
            secret,
            options

        )


        res.cookie('token', token, {

            maxAge: 3.6e+6,
            httpOnly: true
        })

        res.status(200)
            .json({
                message: `login Successfull`
            })


    } catch (error) {
        if (error.isJoi === true) {
            error.status = 400
        }
        next(error)
    }

}


const logout = async (req, res, next) => {

    try {

        res.clearCookie('token')
        res.status(200).json({
            message: `logOut Successfull`
        })

    } catch (error) {
        next(error)
    }
}


const updatePassword = async (req, res, next) => {

    try {

        const validationResult = await validatePassword.validateAsync(req.body)
        let { password, newPassword } = validationResult

        const isUserExist = await userModel.findById(req['loggedInUser'])

        const isMatch = await compare(password, isUserExist.password)
        if (!isMatch) {
            throw createError(400, 'incorrect Password')
        }

        if (!newPassword) {
            throw createError(400, `please enter a new password`)
        }

        newPassword = await hash(newPassword, 10)

        const updatedUser = await userModel.findByIdAndUpdate(isUserExist._id,
            { password: newPassword },
            { new: true }
        )

        res.send(updatedUser)

    } catch (error) {
        next(error)
    }

}


const forgotPassword = async (req, res, next) => {

    try {

        let email = req.body

        let isUserExist = userModel.findOne({ email: email })

        if (!isUserExist) {
            throw createError(404, `user not found Please check your Email`)
        }

        const transporter = nodemailer.createTransport({

            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }

        })

        const mailOptions = {

            from: process.env.MY_EMAIL,
            to: email,
            subject: `message From ${something} : reset password`,
            text: `http://localhost:3000/updatepassword`

        }

        transporter.sendMail(mailOptions, (err, info) => {

            if (err) {

                console.log(err)
                req.flash('error', 'Something Went Wrong! Mail Has Not Been Sent')
                return res.redirect('/')
            }
            else {

                console.log(`Email sent : ${info.response}`)
                return

            }

        })

    } catch (error) {
        next(error)
    }

}


module.exports = {

    register,
    login,
    logout,
    updatePassword,
    forgotPassword

}