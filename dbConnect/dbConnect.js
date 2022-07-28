
require('dotenv').config()
const mongoose = require('mongoose')

mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(_ => console.log('connected To DB'))
    .catch(err => console.log(err))


