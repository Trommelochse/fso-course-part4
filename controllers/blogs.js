const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

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

blogRouter.post('/', tokenExtractor, userExtractor, async (request, response) => {
  const {
    title,
    author,
    url
  } = request.body
  const user = request.user

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

blogRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response) => {

  const id = request.params.id
  const blog = await Blog.findById(id)

  if (!blog) {
    return response.sendStatus(204)
  }

  const user = request.user

  if(user._id.toString() === blog.user._id.toString()) {
    await Blog.findByIdAndRemove(id)

    user.blogs = user.blogs.filter(b => b.toString() !== id)
    await user.save()

    response.sendStatus(204)
  } else {
    return response.status(401).json({
      error: 'Not auhorized (wrong user)'
    })
  }
})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const updatedBlog =  await Blog
    .findByIdAndUpdate(id, request.body, {
      new: true,
      runValidators: true,
      context: 'query',
    })
    .populate('user', { username: 1, name: 1 })

  response.json(updatedBlog)
})

module.exports = blogRouter