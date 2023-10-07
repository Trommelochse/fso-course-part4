const { Router } = require('express')
const Blog = require('../models/blog')

const blogRouter = Router()

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
  if (blog) {
    response.json(blog)
  }
  else {
    response.sendStatus(404)
  }
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const newBlog = await blog.save()
  response.status(201).json(newBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndRemove(id)

  response.sendStatus(204)
})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const updatedBlog =  await Blog.findByIdAndUpdate(id, request.body, {
    new: true,
    runValidators: true,
    context: 'query'
  })

  response.json(updatedBlog)
})

module.exports = blogRouter