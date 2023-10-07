const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const helper = require('./helper.js')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const newBlogs = helper.initialBlogs.map(blog => new Blog(blog))
  const promises = newBlogs.map(blog => blog.save())
  await Promise.all(promises)
})

describe('Getting Blogs', () => {
  test('Returns correct number of blogs', async () => {
    const blogs = await helper.blogsInDb()
    console.log(blogs)
    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })
})

describe('Blog document format', () => {
  test('Blogs have "id" property', async () => {
    const blogs = await helper.blogsInDb()
    expect(blogs[0].id).toBeDefined()
  })
})
describe('Adding Blogs', () => {
  test('A new blog has been saved', async () => {
    const newBlog = {
      title: 'A new beginning',
      author: 'God knows who..',
      likes: 15
    }
    await api
      .post('/api/blog')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newBlogList = await helper.blogsInDb()
    expect(newBlogList).toHaveLength(helper.initialBlogs.length + 1)

    const titles = newBlogList.map(n => n.title)
    expect(titles).toContain('A new beginning')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})