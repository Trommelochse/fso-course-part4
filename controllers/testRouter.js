const testController = require('express').Router()
const Blog = require('../models/blog')

testController.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  response.sendStatus(204)
})

module.exports = testController