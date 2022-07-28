
const router = require('express').Router()
const { register, login, logout, updatePassword } = require('../controller/userController')
const { protected } = require('../middleware/auth')

router.get('/testing', (req, res) => {
    res.send('hi there from server')
})

router.post('/register', register)
    .get('/login', login)
    .get('/logout', protected, logout)
    .post('/updatePassword', protected, updatePassword)

module.exports = router