const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./helper.js')

const api = supertest(app)

let token

beforeEach(async () => {
  const { username, password, name } = helper.initialUsers[0]

  // Create one user & log in
  await User.deleteMany({})
  await api
    .post('/api/users')
    .send({ username, password, name })

  const response = await api
    .post('/api/login')
    .send({ username, password })

  token = response.body.token

  // Create two blogs with user
  await Blog.deleteMany({})
  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + token)
    .send(helper.initialBlogs[0])

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + token)
    .send(helper.initialBlogs[1])
})

describe('When there are two blogs', () => {
  test('Returns correct number of blogs', async () => {
    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length)
  }, 1000000)
})

describe('Blog document format', () => {
  test('Blogs have "id" property', async () => {
    const blogs = await helper.blogsInDb()
    expect(blogs[0].id).toBeDefined()
  }, 1000000)
})

describe('Adding Blogs', () => {
  test('A new blog has been saved when user is authenticated', async () => {
    const newBlog = {
      title: 'A new beginning',
      author: 'God knows who..',
      url: 'https://faz.net'
    }
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newBlogList = await helper.blogsInDb()
    expect(newBlogList).toHaveLength(helper.initialBlogs.length + 1)

    const titles = newBlogList.map(n => n.title)
    expect(titles).toContain('A new beginning')
  },1000000)
})

describe('Deleting a Blog', () => {
  test('Blog does not exist anymore', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    const id = blogsAtBeginning[0].id

    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    await api
      .get(`/api/blogs/${id}`)
      .expect(404)
  }, 1000000)
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
  }, 1000000)
})

afterAll(async () => {
  await mongoose.connection.close()
})