const express = require('express')
const app = express()
const { MONGO_URI } = require('./utils/config')
const cors = require('cors')
const blogRouter = require('./controllers/blogs')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

mongoose.connect(MONGO_URI)

app.use(cors())
app.use(express.json())

/** define routes */
app.use('/api/blog', blogRouter)

module.exports = app