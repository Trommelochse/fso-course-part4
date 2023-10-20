const express = require('express')
const app = express()
const { MONGODB_URI } = require('./utils/config')
const cors = require('cors')
const mongoose = require('mongoose')

require('express-async-errors')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const blogRouter = require('./controllers/blogs')
const testRouter = require('./controllers/testRouter')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogRouter)

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app