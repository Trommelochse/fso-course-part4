const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'hallo',
    author: 'Ben',
    likes: 24,
    url: 'https://google.com'
  },
  {
    title: 'Tschüssikovski',
    author: 'Lisa',
    likes: 1,
    url: 'https://bing.com'
  }
]

const blogsInDb = async () => {
  const response = await Blog.find({})
  return response.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, blogsInDb }