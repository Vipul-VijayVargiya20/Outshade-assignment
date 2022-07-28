require('dotenv').config()
const express = require('express')
require('./dbConnect/dbConnect')
const app = express()
const port = process.env.PORT || 3000
var cookieParser = require('cookie-parser')
const userRoutes = require('./routes/userRoutes')
const eventRoutes = require('./routes/eventRoutes')
const { notFound, errorHandler } = require('./utils/errors')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())



app.use('/', userRoutes)
app.use('/', eventRoutes)
app.use(notFound)
app.use(errorHandler)

app.listen(port, _ => console.log(`server is listening on port ${port}`))