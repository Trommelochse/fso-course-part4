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
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newBlogList = await helper.blogsInDb()
    expect(newBlogList).toHaveLength(helper.initialBlogs.length + 1)

    const titles = newBlogList.map(n => n.title)
    expect(titles).toContain('A new beginning')
    console.log(titles.length)
  })
})

describe('Deleting a Blog', () => {
  test('Blog does not exist anymore', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    const id = blogsAtBeginning[0].id

    await api
      .delete(`/api/blogs/${id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    await api
      .get(`/api/blogs/${id}`)
      .expect(404)
  })
})

describe('Updating a blog', () => {
  test('Likes have been updated', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    const id = blogsAtBeginning[0].id

    const newBlog = {
      author: 'Vlad',
      title: 'Bossa Nova',
      likes: 99,
      url: 'https://yahoo.com'
    }

    await api
      .put(`/api/blogs/${id}`)
      .send(newBlog)
      .expect(200)

    const res = await api.get(`/api/blogs/${id}`)
    const updatedBlog = res.body
    expect(newBlog.likes).toBe(updatedBlog.likes)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})