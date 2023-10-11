const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()

const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  if (user === null) {
    return response.status(400).json({
      error: 'User does not exist.'
    })
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.passwordHash)

  if (!passwordIsCorrect) {
    return response.status(401).json({
      error: 'Password does not match.'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200).send({
    token,
    username: user.username,
    name: user.name
  })
})

module.exports = loginRouter