const express = require('express')
const app = express()
const { MONGODB_URI } = require('./utils/config')
const cors = require('cors')
const mongoose = require('mongoose')

require('express-async-errors')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const blogRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

/** define routes */
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app