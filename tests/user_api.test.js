const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const User = require('../models/user')
const helper = require('./helper.js')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const newUsers = helper.initialUsers.map(u => new User(u))
  const promises = newUsers.map(u => u.save())
  await Promise.all(promises)
})

afterEach(async () => {
  await User.deleteMany({})
})

describe('When two users exist in DB', () => {

  test('Creating a valid user returns 201 and stores the user in DB', async () => {
    const newUser = {
      name: 'Will Smith',
      username: 'boss',
      password: 'notpassword',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)
    expect(usersAtEnd.map(u => u.username)).toContain(newUser.username)
  })

  test('Creating a user with a short password returns appropriate status and error', async () => {
    const newUser = {
      name: 'Allister',
      username: 'Bundy',
      password: '1',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('Password must be at least 3 characters')

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })

  test('Creating a user without username returns 400 and appropriate error', async () => {
    const newUser = {
      name: 'Gandalf',
      username: null,
      password: 'Frodo',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('Username is required')

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })

  test('Creating existing users returns 400 and does not store user', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      name: 'Clemens',
      username: 'root',
      password: 'changeme',
    }
    const result =  await api
      .post('/api/users')
      .send(newUser)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})