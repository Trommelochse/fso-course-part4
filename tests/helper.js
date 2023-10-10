const Blog = require('../models/blog')
const User = require('../models/user')

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

const initialUsers = [
  {
    name: 'Hans Dieter',
    username: 'Magdeburg78',
    password: 'very_secret',
  },
  {
    name: 'Clemens',
    username: 'root',
    password: 'changeme',
  }
]

const usersInDb = async () => {
  const response = await User.find({})
  return response.map(u => u.toJSON())
}

module.exports = { initialBlogs, blogsInDb, initialUsers, usersInDb }