const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.post('/', async (request, response) => {
  const { name, username, password } = request.body

  if (username === null) {
    return response.status(400).send({
      error: 'Username is required'
    })
  }

  if (password.length < 3) {
    return response.status(400).send({
      error: 'Password must be at least 3 characters'
    })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    name,
    username,
    passwordHash
  })

  const newUser = await user.save()

  response.status(201).send({ newUser })
})

userRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, likes: 1,  })
  response.json(users)
})



module.exports = userRouter