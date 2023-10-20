const testController = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

testController.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  response.sendStatus(204)
})

module.exports = testController