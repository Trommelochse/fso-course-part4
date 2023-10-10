const { Router } = require('express')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const blogRouter = Router()

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog
    .findById(id)
    .populate('user', { username: 1, name: 1 })

  if (blog) {
    response.json(blog)
  }
  else {
    response.sendStatus(404)
  }
})

blogRouter.post('/', async (request, response) => {
  const {
    title,
    author,
    url
  } = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken) {
    response.status(401).json({
      error: 'invalid token'
    })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title,
    author,
    url,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  const id = request.params.id
  const blog = await Blog.findById(id)

  if (!blog) {
    return response.sendStatus(204)
  }

  if(decodedToken.id === blog.user._id.toString()) {
    await Blog.findByIdAndRemove(id)

    const user = await User.findById(decodedToken.id)
    user.blogs = user.blogs.filter(b => b.toString() !== id)
    user.save()

    response.sendStatus(204)
  } else {
    return response.status(401).json({
      error: 'Not auhorized (wrong user)'
    })
  }
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